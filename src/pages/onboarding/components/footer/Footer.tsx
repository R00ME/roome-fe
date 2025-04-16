import FooterBrandInfo from './FooterBrandInfo';
import RepositoryLinks from './RepositoryLinks';

const Footer = () => {
  return (
    <footer className='w-full h-fit bg-[#38383F] px-12 py-14 text-white flex justify-between'>
      <FooterBrandInfo />
      <RepositoryLinks />
    </footer>
  );
};

export default Footer;
