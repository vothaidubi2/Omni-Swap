import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import CloseIcon from 'src/icons/CloseIcon';
import JupiterLogo from 'src/icons/JupiterLogo';
import MenuIcon from 'src/icons/MenuIcon';
import HeaderLinks from './HeaderLinks';
import HeaderLinksMobile from './HeaderLinksMobile';

const AppHeader: React.FC<{}> = () => {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const handleToggleMenu = () => setOpenMobileMenu(!openMobileMenu);

  useEffect(() => {
    const body = document.querySelector('body');
    if (openMobileMenu) {
      body!.style.overflow = 'hidden';
    } else {
      body!.style.overflow = '';
    }
  }, [openMobileMenu]);

  return (
    <>
      <div className="flex items-center justify-between w-full bg-black/[.35]">
        <div className="flex items-center flex-1 p-4">
          <button onClick={handleToggleMenu} type="button" className="w-6 mr-3 md:hidden text-white">
            {openMobileMenu ? <CloseIcon /> : <MenuIcon />}
          </button>

          <Link href="https://jup.ag" shallow className="flex-1">
            <h1 className="flex items-center text-lg font-semibold text-white">
              <JupiterLogo />
              <span className="ml-3">Omni Swap</span>
            </h1>
          </Link>
        </div>

        <div className="flex-1" />
      </div>

    </>
  );
};

export default AppHeader;
