'use client';

import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

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
  const [characters, setCharacters] = useState<Record<string, string[]>>({})
  const [characterSelections, setCharacterSelections] = useState<Record<string, string>>({})
  const [roles, setRoles] = useState<Record<string, { dps: boolean; tank: boolean; sup: boolean }>>({});
  const [contentParticipation, setContentParticipation] = useState<Record<
    string,
    { chest?: string; war?: string; manor?: string }
  >>({});
  const [reasonNote, setReasonNote] = useState<
    Record<string, { reason?: string; note?: string; reasonSaved?: boolean; noteSaved?: boolean }>
  >({});
  const [results, setResults] = useState<Record<string, string>>({});

  const weaponOptions = [
    'Sách băng',
    'Carrot',
    'Đao lửa',
    'Kiếm Sky',
    'Đao Sky',
    'Grailseeker',
    'Bearpaw',
    'Doom 3',
    'Tử thần 3',
    'Totem',
    'Chấm bi',
    'Quạt',
    'Chân nhện',
  ];

  const weaponOptions2 = [
    'Bọ lửa',
    'Bọ băng',
    'Gậy cừu',
    'Cây thông',
    'Gậy băng',
    'Mỏ neo',
    'Tim độc',
    'Tim lửa',
    'Cốc',
    'Khiên băng',
    'Cuốc băng/ bồ cào',
    'Đồng hồ',
    'Chọt băng',
    'Dây hồng hài nhi',
    'Bom',
  ];

  const character = [
    'Ninja',
    'Vua nhím',
    'Demon',
    'Bombano',
    'Druid',
    'Bard',
    'Sparta',
    'Vampire',
    'Wyvern',
    'Mummy',
    'Enginer',
    'Swordman',
    'Fighter',
    'Berserker',
    'Witch',
    'Wyvern',
    'Necromancer',
    'Paladin',
    'Nun',
    'King',
    'Slime',
    'Tiên đần',
    'Thỏ',
    'Chó',
    'Gả',
    'Lẩu',
    'Khỉ đá',
    'Chuột',
    'Già băng',
    'Ảo thuật gia',
    'Người cây',
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/user_choices', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      setData(response.data);
    } catch (error: unknown) {
      const err = error as AxiosError;
      setError(`Không thể tải dữ liệu: ${err.message}`);
    } finally {
      setLoading(false);
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
        return { ...prev, [userKey]: [...current, value] };
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
      return {
        ...prev,
        [userKey]: current.filter((w) => w !== value),
      };
    });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-white to-gray-200 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Danh sách người đã tham gia</h2>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-300">
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
                      <td className="border px-2 py-1">{user.name}</td>

                      {/* DPS Weapon Column */}
                      <td className="border px-2 py-1">
                        <div className="flex flex-col gap-2">
                          <select
                            value={weaponSelections[key] || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setWeaponSelections((prev) => ({ ...prev, [key]: val }));
                              handleWeaponAdd(key, val, setDpsWeapons);
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

                      {/* ✅ Sub & Tank Weapon Column */}
                      <td className="border px-2 py-1 ">
                        <div className="flex flex-col gap-2">
                          <select
                            value={subTankSelections[key] || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSubTankSelections((prev) => ({ ...prev, [key]: val }));
                              handleWeaponAdd(key, val, setSubAndTankWeapons);
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
                              setCharacterSelections((prev) => ({ ...prev, [key]: '' }));
                            }}
                            className="w-full p-1 border rounded"
                          >
                            <option value="" disabled>Chọn nhân vật</option>
                            {character.map((character) => (
                              <option key={character} value={character}>{character}</option>
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
                            onChange={(e) =>
                            setRoles((prev) => ({
                                ...prev,
                                [key]: { ...prev[key], dps: e.target.checked },
                            }))
                            }
                        />
                        </td>
                        <td className="border px-2 py-1 text-center">
                        <input
                            type="checkbox"
                            checked={roles[key]?.tank || false}
                            onChange={(e) =>
                            setRoles((prev) => ({
                                ...prev,
                                [key]: { ...prev[key], tank: e.target.checked },
                            }))
                            }
                        />
                        </td>
                        <td className="border px-2 py-1 text-center">
                        <input
                            type="checkbox"
                            checked={roles[key]?.sup || false}
                            onChange={(e) =>
                            setRoles((prev) => ({
                                ...prev,
                                [key]: { ...prev[key], sup: e.target.checked },
                            }))
                            }
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
                            onChange={(e) =>
                                setContentParticipation((prev) => ({
                                ...prev,
                                [key]: { ...prev[key], chest: e.target.value },
                                }))
                            }
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
                            onChange={(e) =>
                                setContentParticipation((prev) => ({
                                ...prev,
                                [key]: { ...prev[key], war: e.target.value },
                                }))
                            }
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
                            onChange={(e) =>
                                setContentParticipation((prev) => ({
                                ...prev,
                                [key]: { ...prev[key], manor: e.target.value },
                                }))
                            }
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
                                }
                            }}
                            className="w-full p-1 border rounded"
                            />
                        )}
                    </td>
                    <td className="border px-2 py-1 text-center">
                        <select
                            value={results[key] || ''}
                            onChange={(e) =>
                            setResults((prev) => ({ ...prev, [key]: e.target.value }))
                            }
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
                                }
                            }}
                            className="w-full p-1 border rounded"
                            />
                        )}
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
