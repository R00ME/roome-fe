import { motion } from 'framer-motion';
import { useState } from 'react';
import ModalBackground from '../../../components/ModalBackground';

export default function CdDeleteModal({
  items,
  onClose,
  onDelete,
}: CdDeleteModalProps) {
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelect = (myCdId: number) => {
    setSelected((prev) =>
      prev.includes(myCdId)
        ? prev.filter((id) => id !== myCdId)
        : [...prev, myCdId],
    );
  };

  const handleDelete = () => {
    if (selected.length > 0) {
      onDelete(selected);
      onClose();
    }
  };

  return (
    <ModalBackground onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.95, x: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className='py-3 px-3.5 sm:p-4 border-2 border-white bg-white/30 filter-blur rounded-2xl sm:rounded-3xl 
                   w-[95vw] max-w-[600px] h-[80vh] max-h-[600px] 
                   sm:w-[90vw] lg:w-[600px] sm:h-[600px]'>
        <div className='gap-4 p-6 sm:p-8 w-full h-full bg-[#fffeff] rounded-xl sm:rounded-2xl flex flex-col'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl sm:text-2xl font-bold text-[#162C63]'>
              삭제할 음악 선택
            </h2>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 text-xl font-bold'>
              ✕
            </button>
          </div>

          {/* 리스트 */}
          <div className='flex-1 overflow-y-auto space-y-2'>
            {items.length === 0 ? (
              <p className='text-sm text-gray-500'>삭제할 음악이 없어요.</p>
            ) : (
              items.map((cd) => (
                <label
                  key={cd.myCdId}
                  className='flex items-center gap-3 p-2'>
                  <input
                    type='checkbox'
                    checked={selected.includes(cd.myCdId)}
                    onChange={() => toggleSelect(cd.myCdId)}
                  />
                  <img
                    src={cd.coverUrl}
                    alt={cd.title}
                    className='w-10 h-10 rounded-md'
                  />
                  <div>
                    <p>{cd.title}</p>
                    <p className='text-xs text-gray-500'>{cd.artist}</p>
                  </div>
                </label>
              ))
            )}
          </div>

          <div className='flex justify-end gap-3 mt-6'>
            <button
              onClick={onClose}
              className='px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium'>
              취소
            </button>
            <button
              onClick={handleDelete}
              disabled={selected.length === 0}
              className={`px-4 py-2 rounded-lg font-medium text-white ${
                selected.length === 0
                  ? 'bg-[#162C63]/30 cursor-not-allowed'
                  : 'bg-[#162C63]/90 hover:bg-[#162C63]'
              }`}>
              삭제하기
            </button>
          </div>
        </div>
      </motion.div>
    </ModalBackground>
  );
}
