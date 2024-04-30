import WrapperContainer from 'components/layout/wrapper-container';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <WrapperContainer>
        <div className=" min-h-screen w-full">{children}</div>
      </WrapperContainer>
    </div>
  );
}
