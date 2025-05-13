import React from 'react';
import Link from 'next/link';
import useAdminStore from '@/store/adminStore';
import { useRouter } from 'next/router';

const HomePage = () => {
	const isLoggedIn = useAdminStore((state) => state.isLoggedIn);
	const router = useRouter();

	const navigateManually = (e) => {
		e.preventDefault();
		router.push('/product/manage');
	};

	return (
		<div className="Home container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-8 text-center">
					<h1 className="mb-4">Toy Shop Admin Portal</h1>
					<p className="mb-4">Welcome to the administration portal.</p>
					
					{isLoggedIn ? (
						<div className="d-grid gap-3">
							<button 
								onClick={navigateManually}
								className="btn btn-primary btn-lg"
							>
								Go to Product Management
							</button>
							
							<div className="mt-3">
								<Link href="/product/manage" className="text-decoration-none">
									Alternative Link to Product Management
								</Link>
							</div>
						</div>
					) : (
						<div className="alert alert-info">
							Please log in to access admin features
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default HomePage;
