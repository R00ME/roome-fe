import { useState } from 'react';

export default function SocialLoginButton({
  handleSocialLogin,
  socialImage,
  socialImageHover,
  className,
  socialName,
}) {
  const [isHover, setIsHover] = useState(false);
  return (
    <button
      onClick={handleSocialLogin}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={`
        ${className} flex items-center rounded-[40px] px-15 py-3 md:px-20 md:py-3.5 
        h-full shadow-logo cursor-pointer md:min-w-[312px]
      `}>
      <div className='w-full min-w-[109px] flex items-center gap-2 md:gap-3.5'>
        <img
          src={isHover ? socialImageHover : socialImage}
          alt={`${socialName}로 로그인`}
          className='w-3 md:w-6 aspect-ratio '
        />
        <p className='font-semibold text-xs md:text-base pt-[1px]'>
          {`${socialName}로 시작하기`}
        </p>
      </div>
    </button>
  );
}
