import FooterMenu from 'components/layout/footer-menu';
import { Suspense } from 'react';
import { Menu } from 'lib/shopify/types';
import Image from 'next/image';
import instagram from '../../assets/svgs/instagram.svg';
import facebook from '../../assets/svgs/facebook.svg';
import twitter from '../../assets/svgs/twitterx.svg';
import youtube from '../../assets/svgs/youtube.svg';
import CustomInputBtn from 'components/elements/custom-input-with-btn';

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  // const currentYear = new Date().getFullYear();
  // const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : '');
  const copyrightDate = 2024;
  const skeleton = 'w-full h-6 animate-pulse rounded bg-neutral-200 ';
  // const menu = await getMenu('next-js-frontend-footer-menu');
  const copyrightName = COMPANY_NAME || SITE_NAME || '';

  type MenuArray = Array<Menu>;

  // Initialize the array with 9 objects of type Menu
  const OrderSupport: MenuArray = [
    { title: 'Order & Support', path: '/' },
    { title: 'Track My Order', path: 'https://foxtalein.shiprocket.co/tracking' },
    { title: 'Order Cancellation', path: 'https://foxtale.in/pages/order-cancellation-request' }
  ];

  const Information: MenuArray = [
    { title: 'Information', path: '/' },
    { title: 'Shipping & Returns', path: '/return-policy' },
    { title: 'Privacy Policy', path: '/privacy-policy' },
    { title: 'Terms of Service', path: '/terms-of-service' }
  ];

  const ContactUs: MenuArray = [
    { title: 'Contact Us', path: '/' },
    { title: 'Get in touch', path: 'https://foxtale.in/pages/contact' },
    { title: 'Store Locator', path: 'https://foxtale.in/pages/store-locator' }
  ];

  return (
    <footer className="w-full font-poppins text-sm text-neutral-500">
      <div className=" w-full bg-[#F3BF97] px-2 py-4 text-sm md:flex-row md:gap-20 md:px-4 md:py-12">
        <div className="mx-2 flex flex-col-reverse items-start justify-between gap-6 border-b border-black pb-6 md:mx-32 lg:flex-row">
          <div className="flex flex-col gap-8 md:flex-row md:gap-20">
            <Suspense
              fallback={
                <div className="flex h-[188px] w-[200px] flex-col gap-2">
                  <div className={skeleton} />
                  <div className={skeleton} />
                </div>
              }
            >
              <FooterMenu menu={OrderSupport} />
            </Suspense>
            <Suspense
              fallback={
                <div className="flex h-[188px] w-[200px] flex-col gap-2">
                  <div className={skeleton} />
                  <div className={skeleton} />
                </div>
              }
            >
              <FooterMenu menu={Information} />
            </Suspense>
            <Suspense
              fallback={
                <div className="flex h-[188px] w-[200px] flex-col gap-2">
                  <div className={skeleton} />
                  <div className={skeleton} />
                </div>
              }
            >
              <FooterMenu menu={ContactUs} />
            </Suspense>
          </div>
          <div className="flex max-w-[420px] flex-col justify-end gap-3 md:gap-7">
            <p className="text-center font-poppins text-xs leading-5 text-black ">
              Stay up to date with our latest offers and product launches & be the first to get
              exclusive offers and sale information
            </p>

            <CustomInputBtn text="Your email address" type="email" buttonText="Subscribe" />
          </div>
        </div>
        <div className=" mx-2 flex flex-col  items-center justify-center space-y-2 pt-6 md:mx-32">
          <div className="footer-logo-first">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="74"
              height="37"
              viewBox="0 0 74 37"
              fill="none"
            >
              <g clipPath="url(#clip0_629_5880)">
                <path
                  d="M73.6167 7.29188C73.3701 7.0749 73.0894 6.97973 72.8212 6.90921C71.9827 6.68878 71.1113 6.67695 70.2694 6.66561C70.0978 6.66561 69.9281 6.66117 69.7614 6.65673C68.5936 6.62714 67.5352 6.41559 66.3718 6.1636C65.341 5.94021 64.3754 5.68477 63.8842 5.02645C63.5616 4.59398 63.4866 4.03082 63.4802 3.63484C63.4768 3.41787 63.5296 3.16095 63.5887 2.88825C63.6607 2.54602 63.7367 2.19195 63.7229 1.81569C63.7145 1.56173 63.6987 1.08882 63.2844 0.825986C62.8702 0.563149 62.4648 0.741661 62.1057 0.895517L61.9987 0.941378C61.0381 1.35772 60.1544 1.93286 59.3848 2.64267C57.9719 3.9248 56.8153 5.67787 56.0396 7.70561C55.4408 9.27129 54.8475 11.2068 54.6897 12.9688C54.6172 13.0344 54.5462 13.0999 54.4737 13.166C54.2202 13.4422 53.91 13.667 53.5934 13.8751C52.9522 14.2869 52.2125 14.5621 51.4554 14.7746C49.9389 15.212 48.3217 15.3733 46.7036 15.4822C45.081 15.5774 43.4422 15.5902 41.7934 15.573C40.3316 15.573 38.8615 15.5602 37.3656 15.7263C34.7024 15.7697 32.0886 17.0815 30.2298 18.6284L30.1804 18.6703C29.1895 17.6058 28.0235 16.7188 26.7331 16.0479C23.5471 14.3712 19.9025 14.0127 16.7155 15.0749C14.622 15.8358 12.9042 17.2052 11.2412 18.5268C8.57798 20.6502 6.06274 22.6563 2.24402 21.9728C1.95348 21.9182 1.65491 21.9229 1.36624 21.9866C1.07757 22.0503 0.804766 22.1718 0.564234 22.3436L0.523792 22.3737C0.357319 22.4995 0.229057 22.6691 0.153298 22.8635C0.0775398 23.0579 0.0572612 23.2696 0.0947222 23.4749C0.587906 26.2403 2.12763 28.5319 4.55261 30.1025C7.41801 31.9567 11.2071 32.5484 14.7245 31.6652C19.5725 30.1735 23.2103 26.8636 27.0615 23.36C28.0075 22.5004 28.9776 21.6197 29.9684 20.7627C30.5132 21.5571 30.927 22.4339 31.1939 23.3595C32.5211 27.4105 30.1252 30.8225 27.7752 33.7023C27.6395 33.8691 27.5656 34.0775 27.5657 34.2925C27.5659 34.5074 27.6403 34.7158 27.7762 34.8823C27.9122 35.0488 28.1014 35.1633 28.312 35.2066C28.5226 35.2498 28.7416 35.2191 28.9322 35.1196C30.9912 34.0436 32.8619 32.6406 34.6714 31.2835L35.4684 30.6873C36.9647 29.5704 38.4728 28.4594 40.1008 27.5392C41.79 26.5845 43.6744 25.7595 45.6561 25.7556H45.6876C46.4334 25.7534 47.1728 25.893 47.8665 26.1668C51.1388 27.4791 51.5906 31.7845 51.954 35.2438L51.9639 35.3395C51.9837 35.5352 52.0625 35.7202 52.19 35.8699C52.3175 36.0197 52.4875 36.1271 52.6775 36.1778C52.7625 36.2012 52.8503 36.2131 52.9384 36.2133C53.0899 36.2132 53.2392 36.1775 53.3742 36.1089C53.5092 36.0404 53.6262 35.941 53.7157 35.8188C55.6391 33.222 57.2592 30.5749 58.5272 27.951C59.0089 26.9467 59.4353 25.9168 59.8045 24.866C59.808 24.8689 59.8124 24.8719 59.8154 24.8748C60.7973 25.7462 61.98 26.657 62.5161 27.6827C63.08 28.7541 63.3022 29.9726 63.1528 31.1741C63.0014 32.3275 62.4623 33.6949 61.3941 34.2872C62.1229 34.203 62.8032 33.8794 63.3283 33.367C63.8708 32.832 64.2249 32.1041 64.3931 31.359C64.7117 29.8535 64.4725 28.2981 63.8171 26.8996C63.5326 26.3463 63.1752 25.8336 62.7543 25.3754C62.3425 24.8714 61.7645 24.4014 61.3383 24.0558C61.215 23.9527 61.0917 23.8511 60.9611 23.7431C60.746 23.5542 60.5468 23.3708 60.3549 23.1903C60.7579 21.8776 61.1041 20.5585 61.4399 19.2251C61.8582 17.5539 62.5279 16.184 63.4299 15.1528C63.6946 14.8502 63.9857 14.5718 64.2999 14.3209C65.1146 13.673 66.3979 13.3228 67.7571 12.952C70.3611 12.2419 73.3124 11.4366 73.9106 8.15929C73.9399 8.00164 73.9283 7.8391 73.8768 7.68723C73.8254 7.53535 73.7358 7.39923 73.6167 7.29188ZM11.7876 28.1423C11.6807 28.9781 11.49 29.801 11.2185 30.5986C9.11062 30.5576 7.04517 29.9664 5.3496 28.8687C3.34333 27.5688 2.04527 25.6979 1.58315 23.4472C1.71147 23.4034 1.84906 23.394 1.98214 23.4201C5.50397 24.0489 8.0483 22.748 10.3411 21.0763C10.6933 21.6948 10.9903 22.3432 11.2288 23.0138C11.52 23.8431 11.713 24.7038 11.8039 25.578C11.8968 26.4306 11.8913 27.291 11.7876 28.1423ZM26.0747 22.2741C22.3482 25.6648 18.8283 28.8672 14.33 30.2519C13.8751 30.3642 13.414 30.4493 12.9491 30.5069C13.2269 29.8078 13.4026 29.0724 13.4709 28.3233C13.5653 27.3151 13.4893 26.2982 13.246 25.3152C13.006 24.3477 12.6041 23.4277 12.0574 22.5941C11.6452 21.9621 11.1374 21.3978 10.5522 20.9214C11.0947 20.5171 11.6264 20.0945 12.1531 19.6743C13.7224 18.4237 15.3445 17.1308 17.1939 16.4581C19.9434 15.5414 23.2522 15.8728 26.0441 17.3458C27.1672 17.9276 28.1843 18.6944 29.0525 19.6142C28.0311 20.4949 27.0408 21.3953 26.0747 22.2746V22.2741ZM57.2045 27.3124C56.1446 29.5068 54.8283 31.7209 53.2846 33.9094C52.8817 30.4358 52.0783 26.2743 48.4125 24.8043C47.6062 24.4818 46.7486 24.3065 45.8805 24.2865C44.9281 24.2865 43.9422 24.4108 41.9453 25.0386C39.1909 26.084 36.5997 28.0116 34.5905 29.5122L33.7905 30.1109C32.748 30.8925 31.6842 31.6889 30.5849 32.4227C32.5285 29.5921 33.7614 26.4829 32.597 22.9324C32.2754 21.8159 31.7688 20.7613 31.0983 19.8124L31.1619 19.7601C32.6907 18.4874 34.7897 17.3867 36.9282 17.2185C38.1373 17.0865 39.354 17.037 40.5699 17.0706C41.0349 17.0879 41.9236 17.0706 42.7399 17.1278C44.0927 17.1115 45.4524 17.0696 46.816 16.9404C48.4973 16.7895 50.1929 16.5134 51.8337 15.9241C52.647 15.6178 53.4489 15.2273 54.1586 14.6745C54.3203 14.5379 54.4885 14.4131 54.6374 14.2603C54.6434 15.3614 54.7854 16.1953 55.1306 17.6584C55.3723 18.6762 55.6504 19.6225 56.117 20.56C56.6215 21.5699 57.7139 23.0399 58.6046 23.7357C58.2175 24.8739 57.745 26.1949 57.2045 27.3129V27.3124ZM59.5461 20.6803C59.4342 21.0985 59.3661 21.5305 59.226 21.9407C59.2152 21.9713 59.2083 21.99 59.1999 22.0167C59.2211 21.9531 58.6426 21.3539 58.5686 21.2578C58.3381 20.9556 58.1241 20.6412 57.9275 20.3159C57.5317 19.6665 57.2233 18.9678 57.0102 18.2378C56.5399 16.5957 56.3335 14.8892 56.3986 13.1823C56.4652 11.4879 56.8061 9.81554 57.4082 8.2303C58.1021 6.41559 59.1264 4.85928 60.3673 3.72854C60.9091 3.23043 61.5166 2.80884 62.1728 2.4755C62.1654 2.51199 62.1575 2.54799 62.1496 2.58497C62.0816 2.90846 62.0017 3.27535 62.0101 3.65703C62.0244 4.53529 62.2645 5.31197 62.7054 5.90274C63.5656 7.05616 65.0653 7.38212 66.0591 7.59712L66.1291 7.61192C66.1854 7.62227 66.2396 7.63115 66.2968 7.64249C67.076 7.79832 67.8711 7.85651 68.6641 7.88264C68.4353 7.90681 68.2069 7.93886 67.9939 7.96894C67.2672 8.06916 66.55 8.22881 65.8495 8.44629C65.1314 8.68053 64.4064 9.00944 63.7332 9.51884C61.6668 11.083 61.2353 13.6039 60.6849 15.9586C60.5576 16.501 60.4279 17.0474 60.3027 17.5928C60.0679 18.6259 59.8203 19.6571 59.5461 20.6808V20.6803ZM70.194 10.5958C69.3595 10.9903 68.3761 11.2606 67.368 11.5357C65.9254 11.9302 64.7127 12.2636 63.6617 13.0999C63.2825 13.4022 62.8726 13.7011 62.5466 14.0714C62.2206 14.4417 61.6994 15.3294 61.432 15.7594C61.7773 14.4748 62.3908 12.8652 62.6734 12.3888C63.1459 11.5915 63.9064 10.8385 64.7043 10.3369C65.63 9.75456 66.8048 9.53807 67.8607 9.34723C68.8076 9.17612 69.2909 9.13174 70.2378 8.96062C70.9964 8.82353 71.7292 8.72491 72.4315 8.39007C72.3975 8.74315 71.9384 9.28559 71.8126 9.43057C71.3485 9.97795 70.8302 10.295 70.194 10.5963V10.5958Z"
                  fill="black"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_629_5880">
                  <rect
                    width="73.8462"
                    height="35.52"
                    fill="white"
                    transform="translate(0.0769043 0.692383)"
                  ></rect>
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="footer-logo-second">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="94"
              height="25"
              viewBox="0 0 94 25"
              fill="none"
            >
              <g clipPath="url(#clip0_629_5884)">
                <path
                  d="M5.56065 21.0176L5.56898 9.73217H9.74243L9.86362 8.74039H5.52841L5.56065 5.85549C5.56065 3.04336 6.11094 0.750515 8.53731 0.750515C9.73359 0.750515 10.5419 1.4299 10.5419 2.65819C10.5419 3.69259 9.99261 4.01591 9.37834 4.20928C9.70082 4.66202 10.2194 4.88814 10.8659 4.88814C12.1573 4.88554 12.9375 4.04554 12.9375 2.97839C12.9375 1.20066 11.0594 0.230713 8.53731 0.230713C5.20489 0.230713 2.71455 2.13787 2.71455 6.85767V8.74039H0.896208L0.883205 9.73217H2.70363L2.71663 21.0176C2.71663 23.1488 2.42484 23.8297 0.872803 24.4764V24.5408H8.37555V24.4764C6.53172 23.9264 5.56065 23.1509 5.56065 21.0176Z"
                  fill="black"
                ></path>
                <path
                  d="M25.6805 14.0253C24.1628 9.75874 19.7449 7.7206 15.1106 9.2483C10.4764 10.776 8.28302 14.9931 9.80073 19.2592C11.3184 23.5252 15.7358 25.5638 20.3701 24.0377C25.0044 22.5116 27.1983 18.2923 25.6805 14.0253ZM20.1626 23.4514C17.1812 24.4343 14.3601 22.0006 13.0088 18.2014C11.6576 14.4021 12.3374 10.815 15.3187 9.83255C18.3 8.85013 21.1206 11.2828 22.4719 15.0826C23.8232 18.8823 23.1434 22.4689 20.1626 23.4514Z"
                  fill="black"
                ></path>
                <path
                  d="M37.896 20.6398L34.5969 15.5353L36.863 12.6416C38.3834 10.7235 39.2249 9.78268 40.9387 8.80493V8.74048H36.6992V8.80753C37.12 9.06743 37.3135 9.36008 37.3135 9.7832C37.3135 10.5312 36.7642 11.4414 36.1172 12.2866L34.1444 14.8528L32.4618 12.2538C31.9115 11.4086 31.2005 10.4652 31.2322 9.65481C31.2322 9.32993 31.3295 9.03729 31.6847 8.80909V8.74464H25.7033V8.80753C27.3859 9.81543 28.2904 10.5962 29.6172 12.6442L32.1726 16.5781L29.003 20.6424C27.4827 22.5927 26.6416 23.5013 24.9263 24.4785V24.5435H29.1653V24.4785C28.7117 24.1864 28.55 23.7955 28.55 23.4057C28.55 22.6259 29.197 21.7475 29.7795 21L32.6241 17.2907L35.0822 21.0296C35.6314 21.8748 36.2784 22.8489 36.3107 23.6312C36.3107 23.9556 36.2139 24.2483 35.8582 24.4759V24.5409H41.8427V24.4759C40.1606 23.4685 39.2556 22.6862 37.896 20.6398Z"
                  fill="black"
                ></path>
                <path
                  d="M51.0625 22.6159C50.7025 22.8078 50.3002 22.9067 49.8922 22.9039C48.4359 22.9039 47.6599 21.8362 47.6599 19.7357V9.7321H52.5136L52.7368 8.74032H47.6594V2.95752H47.3993C46.8729 5.56433 46.7726 8.74032 42.5476 8.74032V9.7321H44.8122V19.8324C44.8122 22.9678 46.3965 24.5522 48.9212 24.5522C50.0727 24.5522 50.947 24.1883 51.604 23.5645C52.5963 22.6866 53.2309 21.1631 53.4135 18.8676H53.0249C52.7097 20.6407 52.0325 22.0103 51.0625 22.6159Z"
                  fill="black"
                ></path>
                <path
                  d="M67.7016 20.8732C67.7016 18.9676 67.8009 16.906 67.8009 14.1256C67.8009 10.408 65.2347 8.84546 60.9577 8.84546C57.5691 8.84546 55.2665 10.658 55.2665 12.6878C55.2665 14.1256 56.3193 14.9687 57.6679 14.9687C58.6218 14.9687 59.3791 14.5009 59.5435 13.5653C59.4088 13.6256 59.263 13.6575 59.1154 13.6588C58.1943 13.6588 57.6024 12.9711 57.6024 12.0033C57.6024 10.6284 58.5235 9.44115 60.9577 9.44115C63.6551 9.44115 64.7738 11.3779 64.7738 13.6588V15.4397L62.2736 15.8768C58.3587 16.5635 54.6414 17.3442 54.6414 20.6871C54.6414 23.3121 56.714 24.5612 59.3131 24.5612C62.0765 24.5612 64.4446 22.5308 64.8071 20.344C64.8071 20.6871 64.8721 21.7189 64.8721 21.8436C65.037 23.4992 66.0242 24.5923 67.8009 24.5923C69.1491 24.5923 70.2018 24.0299 70.7609 23.2804V23.218C70.4587 23.3854 70.1182 23.4715 69.7727 23.468C68.3928 23.4659 67.7016 22.5916 67.7016 20.8732ZM64.7078 18.624C64.6428 21.5291 62.6023 23.1852 60.5302 23.1852C58.9511 23.1852 57.7335 22.4352 57.7335 20.3736C57.7335 18.1551 59.3131 17.0308 62.5706 16.4372L64.7749 16.0307L64.7078 18.624Z"
                  fill="black"
                ></path>
                <path
                  d="M76.2289 21.0293V0.3396H71.3767V0.404055C72.9298 1.05069 73.3828 2.02012 73.3828 3.86334V21.0293C73.3828 23.1605 73.0916 23.8414 71.5385 24.4875V24.5525H78.0728V24.4875C76.5202 23.8414 76.2289 23.1625 76.2289 21.0293Z"
                  fill="black"
                ></path>
                <path
                  d="M93.1278 18.8667H92.6872C92.3231 20.6278 91.259 22.0104 89.6185 22.5656C88.7208 22.8692 87.8069 22.8775 86.8702 22.7486C86.0877 22.6424 85.3284 22.4062 84.6238 22.0499C83.7531 21.6086 82.963 20.976 82.4169 20.161C82.2777 19.9527 82.1559 19.7333 82.0528 19.505C81.9268 19.2279 81.8189 18.943 81.7298 18.652C81.6258 18.3027 81.5873 17.9269 81.6882 17.576C81.7932 17.1979 82.0383 16.8739 82.3737 16.67C82.8939 16.3415 83.6515 16.1055 84.6467 15.962C85.0933 15.9048 85.7994 15.8433 86.7651 15.7775C88.0741 15.6857 89.1358 15.5691 89.9503 15.4277C90.7649 15.2863 91.4663 15.0091 92.0548 14.596C92.6442 14.184 92.979 13.572 93.0591 12.76C93.1262 12.0734 92.8349 11.4886 92.4038 10.9891C92.3564 10.934 92.3049 10.882 92.2566 10.8269C91.7099 10.2057 90.9417 9.7613 90.1958 9.42343C89.2867 9.01279 88.3567 8.83658 87.3664 8.76225C85.9064 8.65257 84.4625 8.97017 83.1628 9.63915C81.9328 10.2659 80.9037 11.2253 80.1929 12.4081C79.6816 13.2461 79.2265 14.1484 78.9768 15.1111C78.7272 16.0738 78.6804 17.0957 78.7537 18.074C78.8057 18.7887 78.9472 19.5097 79.2515 20.1631C79.7971 21.3357 80.5658 22.3426 81.644 23.0968C83.506 24.401 85.4456 24.6994 87.6592 24.4519C89.58 24.2367 91.5601 23.1847 92.5114 21.4511C92.9301 20.6865 93.1226 19.7992 93.1314 18.9316C93.1314 18.9099 93.1302 18.8882 93.1278 18.8667ZM81.4027 15.3767C81.4643 14.6913 81.5928 14.0135 81.7865 13.3531C82.1194 12.2496 82.7623 11.2521 83.6855 10.5613C84.3887 10.0347 85.2458 9.75715 86.1191 9.69633C87.615 9.59237 89.3959 9.96715 90.0424 11.4943C90.2785 12.0505 90.342 12.6899 90.1688 13.2663C90.0273 13.7458 89.7227 14.1608 89.3075 14.4395C88.8175 14.7602 88.17 14.8491 87.6015 14.9281C86.4973 15.0815 85.3764 15.1199 84.2836 15.344C83.5773 15.488 82.8793 15.7141 82.2552 16.0795C81.9431 16.2614 81.6934 16.5229 81.3891 16.7064C81.3578 16.2635 81.3623 15.8189 81.4027 15.3767Z"
                  fill="black"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_629_5884">
                  <rect
                    width="92.3077"
                    height="24.36"
                    fill="white"
                    transform="translate(0.846191 0.230713)"
                  ></rect>
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className=" items-center justify-center">
            <ul className="flex flex-row gap-2">
              <li>
                <a
                  href="https://www.facebook.com/foxtaleskin"
                  target="_blank"
                  aria-describedby="a11y-new-window-external-message"
                  rel="noopener"
                >
                  <Image width={22} height={22} alt="social-media" src={facebook} />
                </a>
              </li>
              <li className="footerikonimagez">
                <a
                  href="https://twitter.com/foxtaleskin"
                  target="_blank"
                  aria-describedby="a11y-new-window-external-message"
                  rel="noopener"
                >
                  <Image width={22} height={22} alt="social-media" src={twitter} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/foxtaleskin"
                  target="_blank"
                  aria-describedby="a11y-new-window-external-message"
                  rel="noopener"
                >
                  <Image width={22} height={22} alt="social-media" src={instagram} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/c/FoxtaleSkin"
                  target="_blank"
                  aria-describedby="a11y-new-window-external-message"
                  rel="noopener"
                >
                  <Image width={22} height={22} alt="social-media" src={youtube} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full border-t border-neutral-200 bg-black  py-1 text-[10px] uppercase text-white ">
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-1 px-4 md:mx-auto">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
