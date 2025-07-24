import login_logo from '@assets/login/login-logo.svg';
import background_img from '@assets/roome-background-img.png';
import SocialLogin from './components/SocialLogin';

export default function LoginPage() {
  return (
    <div
      style={{ backgroundImage: `url(${background_img})` }}
      className={`
        bg-cover bg-center bg-no-repeat h-screen overflow-auto
        flex items-center justify-center xl:px-70 md:py-20 md:px-40 py-30 px-8
      `}>
      <div
        className={`
          w-full h-full p-2 md:p-4.5 md:rounded-4xl rounded-3xl min-w-[315px] max-w-[1200px] min-h-[470px]
          border-2 border-[#FCF7FD] bg-[#FCF7FD33] backdrop-blur-lg 
          `}>
        {/* 로그인 박스 */}
        <div
          className={`
          flex flex-col items-center justify-center md:rounded-3xl rounded-2xl gap-12 md:gap-10
          w-full h-full bg-[#FCF7FD66] backdrop-blur-lg 
          px-20 pt-30 pb-20 lg:py-40 lg:px-20
          `}>
          <img
            className='w-40 md:w-60 lg:w-80 h-auto'
            src={login_logo}
            alt='RoomE'
          />
          <SocialLogin/>
        </div>
      </div>
    </div>
  );
}
