import { useState } from 'react';

export const useDataListState = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleComplete = () => {
    setIsEdit(false);
    setSelectedIds([]);
  };

  const handleItemSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((selectedId) => selectedId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const resetSelection = () => {
    setSelectedIds([]);
  };

  return {
    isEdit,
    selectedIds,
    handleEdit,
    handleComplete,
    handleItemSelect,
    resetSelection,
  };
};
