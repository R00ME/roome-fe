import logo from '@/assets/header-logo.svg';
import { Link } from 'react-router-dom';

const FooterBrandInfo = () => {
  return (
    <div className='flex flex-col gap-4'>
      <Link to='#top'>
        <img
          src={logo}
          alt='RoomE'
          width={240}
          className='opacity-80 hover:opacity-100 duration-300'
        />
      </Link>
      <p className='text-sm flex items-center gap-4'>
        <Link
          to='https://occipital-latency-3e8.notion.site/RoomE-1dd413a1ee8180e8869be91aaea0b81c?pvs=4'
          className='opacity-60 hover:opacity-100 duration-300 link-hover'>
          개인정보처리방침
        </Link>
        <Link
          to='https://occipital-latency-3e8.notion.site/RoomE-1dd413a1ee81807aaa21cfc6ebb5a6c2?pvs=4'
          className='opacity-60 hover:opacity-100 duration-300 link-hover'>
          이용약관
        </Link>
      </p>
      <span className='text-sm opacity-60'>
        © 2025 RoomE. All rights reserved.
      </span>
    </div>
  );
};

export default FooterBrandInfo;
