import { db } from "./config";
import {
  doc,
  collection,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  orderBy,
  arrayUnion,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const MEMBER_COLORS = [
  "#e05c5c",
  "#4caf7d",
  "#4a90d9",
  "#a07c2e",
  "#e8837a",
  "#9b6dce",
];

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getWeekKey() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return `${monday.getFullYear()}-${monday.getMonth() + 1}-${monday.getDate()}`;
}

export async function createGroup(user, groupName) {
  const code = generateCode();
  const member = {
    uid: user.uid,
    name: user.displayName || user.email.split("@")[0],
    avatar: (user.displayName || user.email).charAt(0).toUpperCase(),
    color: MEMBER_COLORS[0],
  };

  const groupRef = await addDoc(collection(db, "groups"), {
    name: groupName,
    code,
    leaderId: user.uid,
    members: [member],
    createdAt: serverTimestamp(),
  });

  await setDoc(
    doc(db, "users", user.uid),
    { groupId: groupRef.id },
    { merge: true },
  );

  await setDoc(doc(db, "sharedNotes", groupRef.id), {
    content: "",
    updatedBy: user.uid,
    updatedAt: serverTimestamp(),
  });

  return groupRef.id;
}

export async function joinGroup(user, code) {
  const q = query(collection(db, "groups"), where("code", "==", code));
  const snap = await getDocs(q);

  if (snap.empty) throw new Error("Group not found. Check the code.");

  const groupDoc = snap.docs[0];
  const groupData = groupDoc.data();

  if (groupData.members.length >= 6)
    throw new Error("Group is full. Max 6 members.");

  const alreadyIn = groupData.members.find(function (m) {
    return m.uid === user.uid;
  });
  if (alreadyIn) {
    await setDoc(
      doc(db, "users", user.uid),
      { groupId: groupDoc.id },
      { merge: true },
    );
    return groupDoc.id;
  }

  const member = {
    uid: user.uid,
    name: user.displayName || user.email.split("@")[0],
    avatar: (user.displayName || user.email).charAt(0).toUpperCase(),
    color: MEMBER_COLORS[groupData.members.length % MEMBER_COLORS.length],
  };

  await updateDoc(doc(db, "groups", groupDoc.id), {
    members: arrayUnion(member),
  });

  await setDoc(
    doc(db, "users", user.uid),
    { groupId: groupDoc.id },
    { merge: true },
  );

  return groupDoc.id;
}

export function subscribeToGroup(groupId, callback) {
  return onSnapshot(doc(db, "groups", groupId), function (snap) {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() });
  });
}

export function subscribeToMessages(groupId, callback) {
  const q = query(
    collection(db, "messages"),
    where("groupId", "==", groupId),
    orderBy("timestamp", "asc"),
  );
  return onSnapshot(q, function (snap) {
    const msgs = snap.docs.map(function (d) {
      return { id: d.id, ...d.data() };
    });
    callback(msgs);
  });
}

export async function sendMessage(groupId, user, text, memberColor) {
  await addDoc(collection(db, "messages"), {
    groupId,
    uid: user.uid,
    name: user.displayName || user.email.split("@")[0],
    avatar: (user.displayName || user.email).charAt(0).toUpperCase(),
    color: memberColor || "#4a90d9",
    text,
    timestamp: serverTimestamp(),
  });
}

export function subscribeToSharedNotes(groupId, callback) {
  return onSnapshot(doc(db, "sharedNotes", groupId), function (snap) {
    if (snap.exists()) callback(snap.data().content || "");
  });
}

export async function updateSharedNotes(groupId, uid, content) {
  await setDoc(
    doc(db, "sharedNotes", groupId),
    {
      content,
      updatedBy: uid,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function leaveGroup(user, groupId, group) {
  const remaining = group.members.filter(function (m) {
    return m.uid !== user.uid;
  });

  if (remaining.length === 0) {
    await deleteDoc(doc(db, "groups", groupId));
  } else {
    let newLeaderId = group.leaderId;
    if (group.leaderId === user.uid) newLeaderId = remaining[0].uid;
    await updateDoc(doc(db, "groups", groupId), {
      members: remaining,
      leaderId: newLeaderId,
    });
  }

  await setDoc(doc(db, "users", user.uid), { groupId: null }, { merge: true });
}

export async function updateGroupName(groupId, newName) {
  await updateDoc(doc(db, "groups", groupId), { name: newName });
}

export async function kickMember(groupId, targetUid, group) {
  const remaining = group.members.filter(function (m) {
    return m.uid !== targetUid;
  });
  await updateDoc(doc(db, "groups", groupId), { members: remaining });
  await setDoc(doc(db, "users", targetUid), { groupId: null }, { merge: true });
}

export async function saveBattleResult(groupId, scores, group) {
  const currentWeekKey = getWeekKey();
  const weeklyXPMap = {};

  // Step 1: Update XP and weeklyXP for each member
  for (const uid of Object.keys(scores)) {
    const xpEarned = scores[uid] * 20;
    try {
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const current = snap.data();
        const newXP = (current.xp || 0) + xpEarned;
        const isNewWeek = current.weekKey !== currentWeekKey;
        const newWeeklyXP = isNewWeek
          ? xpEarned
          : (current.weeklyXP || 0) + xpEarned;

        await updateDoc(ref, {
          xp: newXP,
          level: Math.floor(newXP / 1000) + 1,
          weeklyXP: newWeeklyXP,
          weekKey: currentWeekKey,
        });

        weeklyXPMap[uid] = newWeeklyXP;
      }
    } catch (e) {}
  }

  // Step 2: For members who didn't play, fetch their existing weeklyXP
  for (const member of group.members) {
    if (weeklyXPMap[member.uid] === undefined) {
      try {
        const snap = await getDoc(doc(db, "users", member.uid));
        if (snap.exists()) {
          const data = snap.data();
          const isNewWeek = data.weekKey !== currentWeekKey;
          weeklyXPMap[member.uid] = isNewWeek ? 0 : data.weeklyXP || 0;
        }
      } catch (e) {}
    }
  }

  // Step 3: Leader = member with highest weeklyXP
  let leaderId = group.leaderId;
  let maxWeeklyXP = -1;

  for (const member of group.members) {
    const wx = weeklyXPMap[member.uid] ?? 0;
    if (wx > maxWeeklyXP) {
      maxWeeklyXP = wx;
      leaderId = member.uid;
    }
  }

  await updateDoc(doc(db, "groups", groupId), { leaderId });
}

export async function startBattle(groupId, subject) {
  await setDoc(doc(db, "battles", groupId), {
    groupId,
    subject,
    status: "waiting",
    questions: [],
    answers: {},
    scores: {},
    startedAt: serverTimestamp(),
  });
}

export function subscribeToBattle(groupId, callback) {
  return onSnapshot(doc(db, "battles", groupId), function (snap) {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() });
    else callback(null);
  });
}

export async function submitAnswer(
  groupId,
  uid,
  questionIndex,
  answer,
  isCorrect,
) {
  const key = `answers.${uid}_${questionIndex}`;
  const scoreKey = `scores.${uid}`;
  const ref = doc(db, "battles", groupId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data();
  const currentScore = (data.scores && data.scores[uid]) || 0;
  await updateDoc(ref, {
    [key]: { answer, isCorrect, timestamp: Date.now() },
    [scoreKey]: isCorrect ? currentScore + 1 : currentScore,
  });
}
