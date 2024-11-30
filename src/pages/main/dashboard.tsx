import {authenticateUser} from '@/services/authService';
import dotenv from 'dotenv';
import {useRouter} from 'next/router';
import {useContext, useEffect, useState} from 'react';
import {AppContext} from '../_app';
import {AppContexts} from '@/types/types';

dotenv.config();

export default function dashboard() {
	const [validated, setValidated] = useState<boolean>(false);
	const {toggleLoading} = useContext(AppContext) as AppContexts;

	const router = useRouter();

	// authenticate user from backend
	const dashboardMainAPI = 'http://localhost:8080/users/dashboard';

	useEffect(() => {
		const checkAuthenticaion = async () => {
			const authenticated = await authenticateUser(dashboardMainAPI);

			console.log('Authenticated : ', authenticated);

			if (!authenticated) {
				router.push('/main/login');
			} else {
				setValidated(true);
			}
		};

		checkAuthenticaion();
	}, []);

	if (!validated) {
		return <div></div>;
	}

	return (
		<div>
			<h1>Dashboard</h1>
		</div>
	);
}
