import { BACKGROUNDS } from '@/constants';
import { useUserStore } from '@/stores/useUserStore';
import { get, getDatabase, ref, query, onValue } from 'firebase/database';

const useFirebase = () => {
	const database = getDatabase();
	const storeUser = useUserStore();

	return {};
};

export default useFirebase;
