import { useCurrentActiveDocument } from '@/store /useCurrentActiveDocument';

const Navbar = (): JSX.Element => {
  const { data } = useCurrentActiveDocument();
  return (
    <nav className="w-full h-[60px] flex justify-between items-center px-5 shadow">
      <div className="capitalize subpixel-antialiased text-2xl">{data?.title}</div>
      <div>Navbar</div>
    </nav>
  );
};

export default Navbar;
