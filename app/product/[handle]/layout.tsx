import Footer from '@/components/layout/footer';
import WrapperContainer from 'components/layout/wrapper-container';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" pb-16 md:pb-24">
      <WrapperContainer>
        <div className=" min-h-screen w-full">{children}</div>
      </WrapperContainer>
      <Footer />
    </div>
  );
}
