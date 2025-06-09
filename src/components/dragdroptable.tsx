"use client";

import React, { useEffect, useState } from 'react';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, KeyboardSensor, DragOverlay, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface User {
  id: string;
  name: string;
}

// Mock Firebase functions for demo
const mockSaveData = async (user: User, inTable: boolean) => {
  console.log('Saving:', user.name, 'inTable:', inTable);
};

const mockFetchData = async () => {
  return {
    left: [
      { id: 'user_1', name: 'LafLaff' },
      { id: 'user_2', name: 'Hí' },
      { id: 'user_3', name: 'Khoai' }
    ],
    table: [
      { id: 'user_4', name: 'Ví dụ' }
    ]
  };
};

export default function DragDropTable() {
  const [newName, setNewName] = useState<string>('');
  const [leftNames, setLeftNames] = useState<User[]>([]);
  const [tableNames, setTableNames] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor)
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await mockFetchData();
      setLeftNames(data.left);
      setTableNames(data.table);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error fetching data:', error.message);
      setError(`Không thể tải dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddName = () => {
    if (!newName.trim()) return;
    const newUser = { id: `user_${Date.now()}`, name: newName.trim() };
    setLeftNames((prev) => [...prev, newUser]);
    mockSaveData(newUser, false);
    setNewName('');
  };

  const handleDeleteName = (userId: string) => {
    setLeftNames((prev) => prev.filter(user => user.id !== userId));
  };

  const handleDeleteFromTable = (userId: string) => {
    const userToMove = tableNames.find(user => user.id === userId);
    if (!userToMove) return;

    // Xóa khỏi bảng bên phải
    const newTableNames = tableNames.filter(user => user.id !== userId);
    // Thêm lại vào danh sách bên trái
    const newLeftNames = [...leftNames, userToMove];
    
    setTableNames(newTableNames);
    setLeftNames(newLeftNames);
    mockSaveData(userToMove, false);
  };

  const handleClearAllNames = () => {
    if (leftNames.length === 0) return;
    if (window.confirm('Bạn có chắc muốn xóa tất cả tên trong danh sách?')) {
      setLeftNames([]);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event:DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Tìm item đang được kéo
    const activeUser = [...leftNames, ...tableNames].find(user => user.id === activeId);
    if (!activeUser) return;

    const isActiveInLeft = leftNames.some(user => user.id === activeId);
    const isActiveInTable = tableNames.some(user => user.id === activeId);

    // Xác định vùng drop
    const isOverLeft = overId === 'left-droppable' || leftNames.some(user => user.id === overId);
    const isOverTable = overId === 'table-droppable' || overId === 'table-placeholder' || tableNames.some(user => user.id === overId);

    if (isActiveInLeft && isOverTable) {
      // Kéo từ trái sang bảng
      const newLeftNames = leftNames.filter(user => user.id !== activeId);
      const insertIndex = overId === 'table-droppable' || overId === 'table-placeholder' 
        ? tableNames.length 
        : tableNames.findIndex(user => user.id === overId);
      
      const newTableNames = [...tableNames];
      newTableNames.splice(insertIndex >= 0 ? insertIndex : tableNames.length, 0, activeUser);

      setLeftNames(newLeftNames);
      setTableNames(newTableNames);
      mockSaveData(activeUser, true);

    } else if (isActiveInTable && isOverLeft) {
      // Kéo từ bảng sang trái
      const newTableNames = tableNames.filter(user => user.id !== activeId);
      const insertIndex = overId === 'left-droppable' 
        ? leftNames.length 
        : leftNames.findIndex(user => user.id === overId);

      const newLeftNames = [...leftNames];
      newLeftNames.splice(insertIndex >= 0 ? insertIndex : leftNames.length, 0, activeUser);

      setLeftNames(newLeftNames);
      setTableNames(newTableNames);
      mockSaveData(activeUser, false);

    } else if (isActiveInLeft && isOverLeft && activeId !== overId) {
      // Sắp xếp lại trong danh sách trái
      const oldIndex = leftNames.findIndex(user => user.id === activeId);
      const newIndex = overId === 'left-droppable' 
        ? leftNames.length - 1 
        : leftNames.findIndex(user => user.id === overId);
      
      if (oldIndex !== newIndex) {
        const newLeftNames = arrayMove(leftNames, oldIndex, newIndex);
        setLeftNames(newLeftNames);
      }

    } else if (isActiveInTable && isOverTable && activeId !== overId) {
      // Sắp xếp lại trong bảng
      const oldIndex = tableNames.findIndex(user => user.id === activeId);
      const newIndex = overId === 'table-droppable' 
        ? tableNames.length - 1 
        : tableNames.findIndex(user => user.id === overId);
      
      if (oldIndex !== newIndex) {
        const newTableNames = arrayMove(tableNames, oldIndex, newIndex);
        setTableNames(newTableNames);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const SortableItem = ({ user, showDelete = false }: { user: User; showDelete?: boolean }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: user.id });
    
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-blue-100 p-3 m-1 rounded-lg shadow-sm hover:bg-blue-200 border border-blue-200 flex items-center justify-between group"
      >
        <span
          {...attributes}
          {...listeners}
          className="cursor-move flex-1 select-none touch-none"
        >
          {user.name}
        </span>
        {showDelete && (
          <button
            onClick={() => handleDeleteName(user.id)}
            className="ml-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity p-1"
            title="Xóa"
          >
            ✕
          </button>
        )}
      </div>
    );
  };

  const SortableRow = ({ user, index }: { user: User; index: number }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: user.id });
    
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <tr ref={setNodeRef} style={style} className="even:bg-gray-50 odd:bg-white hover:bg-blue-50">
        <td className="border text-center px-4 py-3 font-medium">{index + 1}</td>
        <td
          {...attributes}
          {...listeners}
          className="border text-center px-4 py-3 cursor-move select-none touch-none"
        >
          {user.name}
        </td>
        <td className="border text-center px-4 py-3">
          <button
            onClick={() => handleDeleteFromTable(user.id)}
            className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50"
            title="Xóa khỏi bảng"
          >
            ✕
          </button>
        </td>
      </tr>
    );
  };

  const DroppableArea = ({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) => {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  };

  const activeUser = activeId ? [...leftNames, ...tableNames].find(user => user.id === activeId) : null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Quản lý danh sách người tham gia</h2>
        
        {loading && <p className="text-center text-blue-600">Đang tải dữ liệu...</p>}
        {error && <p className="text-red-600 text-center bg-red-50 p-3 rounded-lg">{error}</p>}

        <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddName()}
            placeholder="Nhập tên người tham gia..."
            className="border border-gray-300 rounded-lg p-3 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddName}
            disabled={!newName.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            Thêm tên
          </button>
        </div>

        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCenter} 
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Danh sách tên bên trái */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Danh sách tên</h3>
                {leftNames.length > 0 && (
                  <button
                    onClick={handleClearAllNames}
                    className="text-sm text-red-600 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>
              
              <SortableContext items={leftNames.map(user => user.id)} strategy={verticalListSortingStrategy}>
                <DroppableArea
                  id="left-droppable"
                  className="min-h-[400px] p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50"
                >
                  {leftNames.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-gray-500">
                      <p className="text-center">
                        Chưa có tên nào<br />
                        <span className="text-sm">Thêm tên mới hoặc kéo từ bảng sang</span>
                      </p>
                    </div>
                  ) : (
                    leftNames.map((user) => (
                      <SortableItem key={user.id} user={user} showDelete={true} />
                    ))
                  )}
                </DroppableArea>
              </SortableContext>
            </div>

            {/* Bảng người tham gia bên phải */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Bảng người tham gia</h3>
              
              <SortableContext 
                items={['table-placeholder', ...tableNames.map(user => user.id)]} 
                strategy={verticalListSortingStrategy}
              >
                <DroppableArea
                  id="table-droppable"
                  className="min-h-[400px] border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
                >
                  <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="text-center px-4 py-3 font-semibold w-20">STT</th>
                        <th className="text-center px-4 py-3 font-semibold">Họ và tên</th>
                        <th className="text-center px-4 py-3 font-semibold w-20">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableNames.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="text-center py-12 text-gray-500">
                            <div id="table-placeholder" className="cursor-pointer hover:bg-blue-50 p-4 rounded-lg mx-4">
                              <p className="font-medium">Kéo tên từ danh sách bên trái vào đây</p>
                              <p className="text-sm mt-1">Hoặc nhấn vào đây để thả</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        tableNames.map((user, index) => (
                          <SortableRow key={user.id} user={user} index={index} />
                        ))
                      )}
                    </tbody>
                  </table>
                </DroppableArea>
              </SortableContext>
            </div>
          </div>

          <DragOverlay>
            {activeUser ? (
              <div className="bg-blue-200 p-3 rounded-lg shadow-lg border-2 border-blue-400 font-medium">
                {activeUser.name}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        <div className="mt-6 text-center text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
          <p><strong>Hướng dẫn:</strong> Kéo tên từ danh sách bên trái vào bảng bên phải để thêm người tham gia.</p>
          <p>Sau khi kéo thả bên trái sang cột hãy xoá ví dụ đó đi.</p>
        </div>
      </div>
    </div>
  );
}