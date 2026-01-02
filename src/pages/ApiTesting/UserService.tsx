import { useState } from 'react';
import {
    useProfile,
    useLogin,
    useRegister,
    useUpdateProfile,
    useLogout,
    useForgotPassword,
    useResetPassword,
    useChangePassword
} from '../../queries/user.queries';
import Alert, { type AlertType } from '../../components/Alert/Alert';


const UserService = () => {

    const { data: profile, isLoading, error, isError } = useProfile();
    const loginMutation = useLogin();
    const registerUser = useRegister();
    const updateProfile = useUpdateProfile();
    const logout = useLogout();
    const forgotPassword = useForgotPassword();
    const resetPassword = useResetPassword();
    const changePassword = useChangePassword();

    const [alert, setAlert] = useState<{ show: boolean; message: string; type: AlertType }>({
        show: false,
        message: '',
        type: 'info'
    });





    const ChangePassword = () => {
        changePassword.mutate(
            {
                currentPassword: '123456',
                newPassword: 'qwerty',
                confirmPassword: 'qwerty'
            },
            {
                onSuccess: (data) => {
                    console.log(data.message);
                    setAlert({ show: true, message: data.message, type: 'success' });
                },
                onError: (error: any) => {
                    console.log(error.response.data.message);
                    setAlert({ show: true, message: error.response.data.message, type: 'error' });
                }
            }
        );
    };



    const ResetPassword = () => {
        resetPassword.mutate(
            {
                email: 'janindupramod@gmail.com',
                token: '274627',
                newPassword: '123456',
                confirmPassword: '123456'
            },
            {
                onSuccess: (data) => {
                    console.log(data.message);
                    setAlert({ show: true, message: data.message, type: 'success' });
                },
                onError: (error: any) => {
                    console.log(error.response.data.message);
                    setAlert({ show: true, message: error.response.data.message, type: 'error' });
                }
            }
        );
    };


    const ForgotPassword = () => {
        forgotPassword.mutate(
            'janindupramod@gmail.com',
            {
                onSuccess: (data) => {
                    console.log(data.message);
                    setAlert({ show: true, message: data.message, type: 'success' });
                },
                onError: (error: any) => {
                    console.log(error.response.data);
                    setAlert({ show: true, message: error.response.data.message, type: 'error' });
                }
            }
        );
    };

    const LogoutUser = () => {
        logout.mutate(
            undefined,
            {
                onSuccess: (data) => {
                    console.log(data.message);
                    setAlert({ show: true, message: data.message, type: 'success' });
                },
                onError: (error: any) => {
                    console.log(error.response.data.message); // See the full response
                    setAlert({ show: true, message: error.response.data.message, type: 'error' });
                }
            }
        );
    };

    const UpdateProfile = () => {
        updateProfile.mutate(
            { FullName: 'works', Phone: 'workingNo' },
            {
                onSuccess: (data) => {
                    console.log(data.message);
                    setAlert({ show: true, message: data.message, type: 'success' });
                },
                onError: (error: any) => {
                    console.log(error.response.data.message); // See the full response
                    setAlert({ show: true, message: error.response.data.message, type: 'error' });
                }
            }
        );
    };

    const GetUserProfile = () => {
        if (!isError) {
            console.log("email :", profile.data.email);
            console.log("fullname :", profile.data.fullName);
            console.log("phone :", profile.data.phone);
        } else {
            setAlert({ show: true, message: (error as any).response.data.message, type: 'error' });
        }
    };

    const LoginUser = () => {
        loginMutation.mutate(
            { email: 'janindupramod@gmail.com', password: '123456' },
            {
                onSuccess: (data) => {
                    setAlert({ show: true, message: data.message, type: 'success' });
                },
                onError: (error: any) => {
                    setAlert({ show: true, message: error.response.data.message, type: 'error' });
                }
            }
        );
    };

    const RegisterUser = () => {
        registerUser.mutate(
            { fullName: 'testing', email: 'testing', password: 'testing', confirmPassword: 'testing', phone: '1234567890', role: 'user' },
            {
                onSuccess: (data) => {
                    console.log(data.message);
                    setAlert({ show: true, message: data.message, type: 'success' });
                },
                onError: (error: any) => {
                    console.log(error.response.data.message);
                    setAlert({ show: true, message: error.response.data.message, type: 'error' });
                }
            }
        );
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Simple Test Page</h1>
            <button onClick={LoginUser}>Click Me</button>

            {alert.show && (
                <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
                    <Alert
                        message={alert.message}
                        type={alert.type}
                        duration={5000}
                        onClose={() => setAlert({ ...alert, show: false })}
                    />
                </div>
            )}
        </div>
    );
};

export default UserService;
