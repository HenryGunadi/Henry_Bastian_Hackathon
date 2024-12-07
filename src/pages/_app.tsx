import '@/styles/globals.css';
import 'tailwindcss/tailwind.css';
import type {AppProps} from 'next/app';
import {MeshProvider} from '@meshsdk/react';
import Head from 'next/head';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {useEffect, useState} from 'react';
import {ToggleAlert} from '@/types/types';
import {AlertCircle} from 'lucide-react';
import {Progress} from '@/components/ui/progress';
import {AppProvider} from '@/contexts/appContext';

export default function App({Component, pageProps}: AppProps) {
	// states
	const [loading, setLoading] = useState<boolean>(false);
	const [alerts, setAlert] = useState<ToggleAlert>({
		success: 'Alert',
		msg: '',
		alert: false,
	});

	// clear alert state
	function clearAlert(): void {
		setAlert({
			success: 'Alert',
			msg: '',
			alert: false,
		});
	}

	// ALERT TIMEOUT
	useEffect(() => {
		if (alerts.alert) {
			const timer = setTimeout(() => {
				clearAlert();
			}, 2000);

			return () => clearTimeout(timer);
		}
	}, [alerts]);

	return (
		<AppProvider
			props={{
				setAlert,
				setLoading,
			}}
		>
			<MeshProvider>
				<Head>
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" />
					<link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap" rel="stylesheet" />
				</Head>

				<div className="overflow-x-hidden relative">
					{alerts.alert && (
						<Alert
							variant={alerts.success === 'Error' ? 'destructive' : 'default'}
							className={alerts.success === 'Success' ? 'text-green-500 border-green-500' : ''}
						>
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>{alerts.success}</AlertTitle>
							<AlertDescription>{alerts.msg}</AlertDescription>
						</Alert>
					)}

					{loading && <Progress value={60} className="w-[100%] absolute" />}

					<Component {...pageProps} />
				</div>
			</MeshProvider>
		</AppProvider>
	);
}
