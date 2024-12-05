import { Link } from 'react-router-dom';

interface HeaderProps {
  account: string | null;
}

const Header: React.FC<HeaderProps> = ({ account }) => {
  return (
    <header className="bg-purple-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Beast Battle Bet</Link>
        {account && (
          <div className="flex items-center space-x-4">
            <span className="text-sm">Connected: {account.slice(0, 6)}...{account.slice(-4)}</span>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

