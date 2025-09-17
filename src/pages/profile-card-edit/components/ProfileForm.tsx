interface ProfileFormProps {
  nickname: string;
  bio: string;
  onNicknameChange: (value: string) => void;
  onBioChange: (value: string) => void;
}

export const ProfileForm = ({
  nickname,
  bio,
  onNicknameChange,
  onBioChange,
}: ProfileFormProps) => {
  return (
    <>
      <div
        aria-label='닉네임 수정'
        className='flex flex-col gap-2 w-[400px] max-sm:w-full'>
        <h2 className='text-lg font-bold text-[#3E507D] max-sm:text-base'>닉네임</h2>
        <input
          type='text'
          value={nickname}
          onChange={(e) => onNicknameChange(e.target.value)}
          placeholder='닉네임을 입력해주세요'
          className='w-full px-4 py-2 bg-[#4E7ACF]/5 rounded-lg outline-none border-2 border-transparent focus:border-[#73A1F7] transition-colors text-[#3E507D]  max-sm:text-sm'
          maxLength={15}
        />
        <span className='text-sm text-[#3E507D]/60 text-right'>
          {nickname.length}/15
        </span>
      </div>

      <div className='flex flex-col gap-2 w-[400px] max-sm:w-full'>
        <h3 className='text-lg font-bold text-[#3E507D] max-sm:text-base'>한 줄 소개</h3>
        <textarea
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          placeholder='나를 표현해보세요 ψ(｀∇´)ψ ♪'
          className='w-full p-4 bg-[#4E7ACF]/5 rounded-lg outline-none resize-none border-2 border-transparent focus:border-[#73A1F7] transition-colors min-h-[100px] text-[#3E507D] max-sm:text-sm'
          maxLength={30}
        />
        <span className='text-sm text-[#3E507D]/60 text-right'>
          {bio.length}/30
        </span>
      </div>
    </>
  );
};
