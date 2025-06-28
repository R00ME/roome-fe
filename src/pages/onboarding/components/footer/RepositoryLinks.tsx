import { Link } from 'react-router-dom';
const RepositoryLinks = () => {
  return (
    <div className='flex flex-col items-end'>
      <div className='text-right flex flex-col mb-4'>
        <p className='mb-1'>1차 개발</p>
        <Link
          to='https://github.com/prgrms-web-devcourse-final-project/WEB2_3_CUBE_BE'
          className='text-sm opacity-60 hover:opacity-100 duration-300 link-hover'>
          @RoomE-CUBE-BE
        </Link>
        <Link
          to='https://github.com/prgrms-web-devcourse-final-project/WEB2_3_CUBE_FE'
          className='text-sm opacity-60 hover:opacity-100 duration-300 link-hover'>
          @RoomE-CUBE-FE
        </Link>
      </div>
      <div className='text-right flex flex-col'>
        <p className='mb-1'>2차 개발</p>
        <Link
          to='https://github.com/R00ME/roome-be'
          className='text-sm opacity-60 hover:opacity-100 duration-300 link-hover'>
          @RoomE-DooRoomE-BE
        </Link>
        <Link
          to='https://github.com/R00ME/roome-fe'
          className='text-sm opacity-60 hover:opacity-100 duration-300 link-hover'>
          @RoomE-DooRoomE-FE
        </Link>
      </div>
    </div>
  );
};

export default RepositoryLinks;
