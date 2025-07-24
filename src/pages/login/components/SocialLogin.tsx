import google from '@assets/login/google-logo.svg';
import kakao_hover from '@assets/login/kakao-hover.svg';
import kakao from '@assets/login/kakao-logo.svg';
import naver_hover from '@assets/login/naver-hover.svg';
import naver from '@assets/login/naver-logo.svg';
import SocialLoginButton from './SocialLoginButton';

export default function SocialLogin() {

  const handleKakaoLogin = () => {
    window.location.replace(
      `${import.meta.env.VITE_API_URL}/oauth2/authorization/kakao`,
    );
  };

  const handleNaverLogin = () => {
    window.location.replace(
      `${import.meta.env.VITE_API_URL}/oauth2/authorization/naver`,
    );
  };

  const handleGoogleLogin = () => {
    window.location.replace(
      `${import.meta.env.VITE_API_URL}/oauth2/authorization/google`,
    );
    console.log('리다이렉트 완료')
  };

  return (
    <div className='flex flex-col gap-2 md:gap-3 items-center'>
      <SocialLoginButton
        handleSocialLogin={handleKakaoLogin}
        socialImage={kakao}
        socialImageHover={kakao_hover}
        socialName='카카오'
        className='bg-[#FAE100] hover:bg-[#261C07] hover:text-[#FAD400] text-[#261C07]'
      />
      <SocialLoginButton
        handleSocialLogin={handleNaverLogin}
        socialImage={naver}
        socialImageHover={naver_hover}
        socialName='네이버'
        className='bg-[#06BE34] hover:bg-white hover:text-[#06BE34] text-white'
      />
      <SocialLoginButton
        handleSocialLogin={handleGoogleLogin}
        socialImage={google}
        socialImageHover={google}
        socialName='구글'
        className='bg-white hover:bg-[#2A3A5E] hover:text-white text-[#292929]'
      />
    </div>
  );
}
