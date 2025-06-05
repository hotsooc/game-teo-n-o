'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';

interface User {
  name: string;
  choices: string[];
}

interface DataType {
  users: Record<string, User>;
}

export default function JoinTable() {
  const [data, setData] = useState<DataType>({ users: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dpsWeapons, setDpsWeapons] = useState<Record<string, string[]>>({});
  const [weaponSelections, setWeaponSelections] = useState<Record<string, string>>({});
  const [subAndTankWeapons, setSubAndTankWeapons] = useState<Record<string, string[]>>({});
  const [subTankSelections, setSubTankSelections] = useState<Record<string, string>>({});
  const [characters, setCharacters] = useState<Record<string, string[]>>({});
  const [characterSelections, setCharacterSelections] = useState<Record<string, string>>({});
  const [roles, setRoles] = useState<Record<string, { dps: boolean; tank: boolean; sup: boolean }>>({});
  const [contentParticipation, setContentParticipation] = useState<
    Record<string, { chest?: string; war?: string; manor?: string }>
  >({});
  const [reasonNote, setReasonNote] = useState<
    Record<string, { reason?: string; note?: string; reasonSaved?: boolean; noteSaved?: boolean }>
  >({});
  const [results, setResults] = useState<Record<string, string>>({});
  const [newUserName, setNewUserName] = useState('');
  const [editingName, setEditingName] = useState<Record<string, string>>({});

  const weaponOptions = [
    'Sách băng', 'Carrot', 'Đao lửa', 'Kiếm Sky', 'Đao Sky', 'Grailseeker', 'Bearpaw',
    'Doom 3', 'Tử thần 3', 'Totem', 'Chấm bi', 'Quạt', 'Chân nhện',
  ];

  const weaponOptions2 = [
    'Bọ lửa', 'Bọ băng', 'Gậy cừu', 'Cây thông', 'Gậy băng', 'Mỏ neo', 'Tim độc',
    'Tim lửa', 'Cốc', 'Khiên băng', 'Cuốc băng/ bồ cào', 'Đồng hồ', 'Chọt băng',
    'Dây hồng hài nhi', 'Bom',
  ];

  // Loại bỏ trùng lặp trong mảng character
  const character = [
    'Ninja', 'Vua nhím', 'Demon', 'Bombano', 'Druid', 'Bard', 'Sparta', 'Vampire',
    'Wyvern', 'Mummy', 'Enginer', 'Swordman', 'Fighter', 'Berserker', 'Witch',
    'Necromancer', 'Paladin', 'Nun', 'King', 'Slime', 'Tiên đần', 'Thỏ',
    'Chó', 'Gả', 'Lẩu', 'Khỉ đá', 'Chuột', 'Già băng', 'Ảo thuật gia', 'Người cây',
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'userData'));
      const usersData: DataType = { users: {} };
      const dpsData: Record<string, string[]> = {};
      const subTankData: Record<string, string[]> = {};
      const charData: Record<string, string[]> = {};
      const roleData: Record<string, { dps: boolean; tank: boolean; sup: boolean }> = {};
      const contentData: Record<string, { chest?: string; war?: string; manor?: string }> = {};
      const reasonData: Record<string, { reason?: string; note?: string; reasonSaved?: boolean; noteSaved?: boolean }> = {};
      const resultData: Record<string, string> = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        usersData.users[doc.id] = data.user || { name: '', choices: [] };
        dpsData[doc.id] = data.dpsWeapons || [];
        subTankData[doc.id] = data.subAndTankWeapons || [];
        charData[doc.id] = data.characters || [];
        roleData[doc.id] = data.roles || { dps: false, tank: false, sup: false };
        contentData[doc.id] = data.contentParticipation || {};
        reasonData[doc.id] = data.reasonNote || {};
        resultData[doc.id] = data.results || '';
      });

      setData(usersData);
      setDpsWeapons(dpsData);
      setSubAndTankWeapons(subTankData);
      setCharacters(charData);
      setRoles(roleData);
      setContentParticipation(contentData);
      setReasonNote(reasonData);
      setResults(resultData);
    } catch (err: any) {
      setError(`Không thể tải dữ liệu: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (userKey: string) => {
    try {
      await setDoc(doc(db, 'userData', userKey), {
        user: data.users[userKey] || { name: '', choices: [] },
        dpsWeapons: dpsWeapons[userKey] || [],
        subAndTankWeapons: subAndTankWeapons[userKey] || [],
        characters: characters[userKey] || [],
        roles: roles[userKey] || { dps: false, tank: false, sup: false },
        contentParticipation: contentParticipation[userKey] || {},
        reasonNote: reasonNote[userKey] || {},
        results: results[userKey] || '',
      });
    } catch (err: any) {
      setError(`Không thể lưu dữ liệu: ${err.message}`);
    }
  };

  const handleWeaponAdd = (
    userKey: string,
    value: string,
    setState: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
  ) => {
    if (!value) return;
    setState((prev) => {
      const current = prev[userKey] || [];
      if (!current.includes(value)) {
        const updated = { ...prev, [userKey]: [...current, value] };
        saveData(userKey);
        return updated;
      }
      return prev;
    });
  };

  const handleWeaponRemove = (
    userKey: string,
    value: string,
    setState: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
  ) => {
    setState((prev) => {
      const current = prev[userKey] || [];
      const updated = { ...prev, [userKey]: current.filter((w) => w !== value) };
      saveData(userKey);
      return updated;
    });
  };

  const handleNameChange = (userKey: string, newName: string) => {
    setData((prev) => {
      const updated = {
        users: {
          ...prev.users,
          [userKey]: { ...prev.users[userKey], name: newName }
        }
      };
      saveData(userKey);
      return updated;
    });
    setEditingName((prev) => ({ ...prev, [userKey]: '' }));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 300000);
    return () => clearInterval(interval);
  }, []);

  const handleAddUser = () => {
    if (!newUserName.trim()) return;
    const newKey = `user_${Date.now()}`;
    setData((prev) => {
      const updated = {
        users: {
          ...prev.users,
          [newKey]: { name: newUserName.trim(), choices: [] }
        }
      };
      saveData(newKey);
      return updated;
    });
    setNewUserName('');
  };

  const handleDeleteUser = async (userKey: string) => {
    try {
      await deleteDoc(doc(db, 'userData', userKey));
      setData((prev) => {
        const newUsers = { ...prev.users };
        delete newUsers[userKey];
        return { ...prev, users: newUsers };
      });
      setDpsWeapons((prev) => { const p = { ...prev }; delete p[userKey]; return p; });
      setWeaponSelections((prev) => { const p = { ...prev }; delete p[userKey]; return p; });
      setSubAndTankWeapons((prev) => { const p = { ...prev }; delete p[userKey]; return p; });
      setSubTankSelections((prev) => { const p = { ...prev }; delete p[userKey]; return p; });
      setCharacters((prev) => { const p = { ...prev }; delete p[userKey]; return p; });
      setCharacterSelections((prev) => { const p = { ...prev }; delete p[userKey]; return p; });
      setRoles((prev) => { const p = { ...prev }; delete p[userKey]; return p; });
      setContentParticipation((prev) => { const p = { ...prev }; delete p[userKey]; return p; });
      setReasonNote((prev) => { const p = { ...prev }; delete p[userKey]; return p; });
      setResults((prev) => { const p = { ...prev }; delete p[userKey]; return p; });
    } catch (err: any) {
      setError(`Không thể xóa người dùng: ${err.message}`);
    }
  };

  const handleDeleteAll = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'userData'));
      const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      setData({ users: {} });
      setDpsWeapons({});
      setWeaponSelections({});
      setSubAndTankWeapons({});
      setSubTankSelections({});
      setCharacters({});
      setCharacterSelections({});
      setRoles({});
      setContentParticipation({});
      setReasonNote({});
      setResults({});
    } catch (err: any) {
      setError(`Không thể xóa tất cả: ${err.message}`);
    }
  };

  const handleStateChange = (userKey: string) => {
    saveData(userKey);
  };

  return (
    <div className="bg-gradient-to-br from-green-100 to-blue-200 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Danh sách người đã tham gia</h2>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          placeholder="Nhập tên người tham gia"
          className="border rounded p-2"
        />
        <button
          onClick={handleAddUser}
          className="bg-gradient-to-l from-blue-300 to-gray-300 text-black px-4 py-2 rounded hover:bg-blue-300"
        >
          Thêm người tham gia
        </button>
        <button
          onClick={handleDeleteAll}
          className="bg-gradient-to-l from-red-400 to-gray-300 text-black px-4 py-2 rounded hover:bg-red-500"
        >
          Xoá tất cả
        </button>
      </div>

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-b from-amber-100 to-sky-100">
              <tr>
                <th rowSpan={2} className="text-center px-4 py-2 border">STT</th>
                <th rowSpan={2} className="text-center px-4 py-2 border">Name</th>
                <th rowSpan={2} className="text-center px-4 py-2 border">DPS Weap</th>
                <th rowSpan={2} className="text-center px-4 py-2 border">Sub & Tank Weap</th>
                <th rowSpan={2} className="text-center px-4 py-2 border">Character</th>
                <th colSpan={3} className="text-center px-4 py-2 border">Role</th>
                <th colSpan={3} className="text-center px-4 py-2 border">Content</th>
                <th rowSpan={2} className="text-center px-4 py-2 border">Reason</th>
                <th rowSpan={2} className="text-center px-4 py-2 border">Result</th>
                <th rowSpan={2} className="text-center px-4 py-2 border">Note</th>
                <th rowSpan={2} className="text-center px-4 py-2 border">Xoá</th>
              </tr>
              <tr>
                <th className="text-center px-4 py-2 border">DPS ⚔️</th>
                <th className="text-center px-4 py-2 border">Tank 🛡</th>
                <th className="text-center px-4 py-2 border">Sup +</th>
                <th className="text-center px-4 py-2 border">Fight Chest</th>
                <th className="text-center px-4 py-2 border">Guild war</th>
                <th className="text-center px-4 py-2 border">Fight Manor</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(data.users).length > 0 ? (
                Object.entries(data.users).map(([key, user], idx) => {
                  const selectedDps = dpsWeapons[key] || [];
                  const selectedSubTank = subAndTankWeapons[key] || [];
                  const selectedCharacter = characters[key] || [];

                  return (
                    <tr key={idx} className="even:bg-white odd:bg-gray-50">
                      <td className="border text-center px-2 py-1">{idx + 1}</td>
                      <td className="border px-2 py-1">
                        {editingName[key] !== undefined ? (
                          <input
                            type="text"
                            value={editingName[key]}
                            onChange={(e) => setEditingName((prev) => ({ ...prev, [key]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleNameChange(key, editingName[key] || user.name);
                              }
                            }}
                            onBlur={() => handleNameChange(key, editingName[key] || user.name)}
                            className="w-full p-1 border rounded"
                            autoFocus
                          />
                        ) : (
                          <div
                            className="cursor-pointer hover:underline"
                            onClick={() => setEditingName((prev) => ({ ...prev, [key]: user.name }))}
                          >
                            {user.name}
                          </div>
                        )}
                      </td>
                      <td className="border px-2 py-1">
                        <div className="flex flex-col gap-2">
                          <select
                            value={weaponSelections[key] || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setWeaponSelections((prev) => ({ ...prev, [key]: val }));
                              handleWeaponAdd(key, val, setDpsWeapons);
                            }}
                            onBlur={() => {
                              setWeaponSelections((prev) => ({ ...prev, [key]: '' }));
                            }}
                            className="w-full p-1 border rounded"
                          >
                            <option value="" disabled>Chọn vũ khí</option>
                            {weaponOptions.map((weapon) => (
                              <option key={weapon} value={weapon}>{weapon}</option>
                            ))}
                          </select>
                          {selectedDps.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {selectedDps.map((w) => (
                                <button
                                  key={w}
                                  onClick={() => handleWeaponRemove(key, w, setDpsWeapons)}
                                  className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                                >
                                  {w} ×
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="border px-2 py-1">
                        <div className="flex flex-col gap-2">
                          <select
                            value={subTankSelections[key] || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSubTankSelections((prev) => ({ ...prev, [key]: val }));
                              handleWeaponAdd(key, val, setSubAndTankWeapons);
                            }}
                            onBlur={() => {
                              setSubTankSelections((prev) => ({ ...prev, [key]: '' }));
                            }}
                            className="w-full p-1 border rounded"
                          >
                            <option value="" disabled>Chọn vũ khí</option>
                            {weaponOptions2.map((weapon) => (
                              <option key={weapon} value={weapon}>{weapon}</option>
                            ))}
                          </select>
                          {selectedSubTank.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {selectedSubTank.map((w) => (
                                <button
                                  key={w}
                                  onClick={() => handleWeaponRemove(key, w, setSubAndTankWeapons)}
                                  className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                                >
                                  {w} ×
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="border px-2 py-1">
                        <div className="flex flex-col gap-2">
                          <select
                            value={characterSelections[key] || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCharacterSelections((prev) => ({ ...prev, [key]: val }));
                              handleWeaponAdd(key, val, setCharacters);
                            }}
                            onBlur={() => {
                              setCharacterSelections((prev) => ({ ...prev, [key]: '' }));
                            }}
                            className="w-full p-1 border rounded"
                          >
                            <option value="" disabled>Chọn nhân vật</option>
                            {character.map((char, index) => (
                              <option key={`${char}-${index}`} value={char}>{char}</option>
                            ))}
                          </select>
                          {selectedCharacter.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {selectedCharacter.map((w) => (
                                <button
                                  key={w}
                                  onClick={() => handleWeaponRemove(key, w, setCharacters)}
                                  className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                                >
                                  {w} ×
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="border px-2 py-1 text-center">
                        <input
                          type="checkbox"
                          checked={roles[key]?.dps || false}
                          onChange={(e) => {
                            setRoles((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], dps: e.target.checked },
                            }));
                            handleStateChange(key);
                          }}
                        />
                      </td>
                      <td className="border px-2 py-1 text-center">
                        <input
                          type="checkbox"
                          checked={roles[key]?.tank || false}
                          onChange={(e) => {
                            setRoles((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], tank: e.target.checked },
                            }));
                            handleStateChange(key);
                          }}
                        />
                      </td>
                      <td className="border px-2 py-1 text-center">
                        <input
                          type="checkbox"
                          checked={roles[key]?.sup || false}
                          onChange={(e) => {
                            setRoles((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], sup: e.target.checked },
                            }));
                            handleStateChange(key);
                          }}
                        />
                      </td>
                      <td className="border px-2 py-1 w-[120px]">
                        <div
                          className={`w-full border rounded ${
                            contentParticipation[key]?.chest === 'Tham gia'
                              ? 'text-green-600'
                              : contentParticipation[key]?.chest === 'Vắng'
                              ? 'text-red-600'
                              : 'text-gray-700'
                          }`}
                        >
                          <select
                            value={contentParticipation[key]?.chest || ''}
                            onChange={(e) => {
                              setContentParticipation((prev) => ({
                                ...prev,
                                [key]: { ...prev[key], chest: e.target.value },
                              }));
                              handleStateChange(key);
                            }}
                            className="w-full p-1 bg-transparent outline-none"
                          >
                            <option value="">--</option>
                            <option value="Tham gia">Tham gia</option>
                            <option value="Vắng">Vắng</option>
                          </select>
                        </div>
                      </td>
                      <td className="border px-2 py-1 w-[120px]">
                        <div
                          className={`w-full border rounded ${
                            contentParticipation[key]?.war === 'Tham gia'
                              ? 'text-green-600'
                              : contentParticipation[key]?.war === 'Vắng'
                              ? 'text-red-600'
                              : 'text-gray-700'
                          }`}
                        >
                          <select
                            value={contentParticipation[key]?.war || ''}
                            onChange={(e) => {
                              setContentParticipation((prev) => ({
                                ...prev,
                                [key]: { ...prev[key], war: e.target.value },
                              }));
                              handleStateChange(key);
                            }}
                            className="w-full p-1 bg-transparent outline-none"
                          >
                            <option value="">--</option>
                            <option value="Tham gia">Tham gia</option>
                            <option value="Vắng">Vắng</option>
                          </select>
                        </div>
                      </td>
                      <td className="border px-2 py-1 w-[120px]">
                        <div
                          className={`w-full border rounded ${
                            contentParticipation[key]?.manor === 'Tham gia'
                              ? 'text-green-600'
                              : contentParticipation[key]?.manor === 'Vắng'
                              ? 'text-red-600'
                              : 'text-gray-700'
                          }`}
                        >
                          <select
                            value={contentParticipation[key]?.manor || ''}
                            onChange={(e) => {
                              setContentParticipation((prev) => ({
                                ...prev,
                                [key]: { ...prev[key], manor: e.target.value },
                              }));
                              handleStateChange(key);
                            }}
                            className="w-full p-1 bg-transparent outline-none"
                          >
                            <option value="">--</option>
                            <option value="Tham gia">Tham gia</option>
                            <option value="Vắng">Vắng</option>
                          </select>
                        </div>
                      </td>
                      <td className="border px-2 py-1">
                        {reasonNote[key]?.reasonSaved ? (
                          <div
                            className="cursor-pointer hover:underline text-sm text-gray-800"
                            onClick={() =>
                              setReasonNote((prev) => ({
                                ...prev,
                                [key]: { ...prev[key], reasonSaved: false },
                              }))
                            }
                          >
                            {reasonNote[key]?.reason || '---'}
                          </div>
                        ) : (
                          <input
                            type="text"
                            placeholder="Lý do"
                            value={reasonNote[key]?.reason || ''}
                            onChange={(e) =>
                              setReasonNote((prev) => ({
                                ...prev,
                                [key]: { ...prev[key], reason: e.target.value },
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                setReasonNote((prev) => ({
                                  ...prev,
                                  [key]: { ...prev[key], reasonSaved: true },
                                }));
                                handleStateChange(key);
                              }
                            }}
                            className="w-full p-1 border rounded"
                          />
                        )}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        <select
                          value={results[key] || ''}
                          onChange={(e) => {
                            setResults((prev) => ({ ...prev, [key]: e.target.value }));
                            handleStateChange(key);
                          }}
                          className={`w-full p-1 border rounded ${
                            results[key] === 'Win'
                              ? 'text-green-600 font-bold'
                              : results[key] === 'Lose'
                              ? 'text-red-600 font-bold'
                              : ''
                          }`}
                        >
                          <option value="">--</option>
                          <option value="Win">Win</option>
                          <option value="Lose">Lose</option>
                        </select>
                      </td>
                      <td className="border px-2 py-1">
                        {reasonNote[key]?.noteSaved ? (
                          <div
                            className="cursor-pointer hover:underline text-sm text-gray-800"
                            onClick={() =>
                              setReasonNote((prev) => ({
                                ...prev,
                                [key]: { ...prev[key], noteSaved: false },
                              }))
                            }
                          >
                            {reasonNote[key]?.note || '---'}
                          </div>
                        ) : (
                          <input
                            type="text"
                            placeholder="Ghi chú"
                            value={reasonNote[key]?.note || ''}
                            onChange={(e) =>
                              setReasonNote((prev) => ({
                                ...prev,
                                [key]: { ...prev[key], note: e.target.value },
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                setReasonNote((prev) => ({
                                  ...prev,
                                  [key]: { ...prev[key], noteSaved: true },
                                }));
                                handleStateChange(key);
                              }
                            }}
                            className="w-full p-1 border rounded"
                          />
                        )}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        <button
                          onClick={() => handleDeleteUser(key)}
                          className="text-black px-2 py-1 rounded hover:bg-red-700 text-xs"
                        >
                          Xoá
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={16} className="text-center py-4 text-gray-500">
                    Chưa có người tham gia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}