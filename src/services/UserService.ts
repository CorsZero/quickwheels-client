import {
    useProfile,
    useLogin,
    useRegister,
    useUpdateProfile,
    useDeleteProfileImage,
    useLogout,
    useForgotPassword,
    useResetPassword,
    useChangePassword
} from '../queries/user.queries';

export const useUserService = () => {
    const { data: profile, isLoading, error, isError } = useProfile();
    const loginMutation = useLogin();
    const registerUser = useRegister();
    const updateProfile = useUpdateProfile();
    const deleteProfileImage = useDeleteProfileImage();
    const logout = useLogout();
    const forgotPassword = useForgotPassword();
    const resetPassword = useResetPassword();
    const changePassword = useChangePassword();

    const ChangePassword = (
        currentPassword: string,
        newPassword: string,
        confirmPassword: string,
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        changePassword.mutate(
            {
                currentPassword,
                newPassword,
                confirmPassword
            },
            {
                onSuccess: (data) => {
                    console.log(data.message);
                    onSuccess?.(data);
                },
                onError: (error: any) => {
                    console.log(error.response.data.message);
                    onError?.(error);
                }
            }
        );
    };

    const ResetPassword = (
        email: string,
        token: string,
        newPassword: string,
        confirmPassword: string,
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        resetPassword.mutate(
            {
                email,
                token,
                newPassword,
                confirmPassword
            },
            {
                onSuccess: (data) => {
                    console.log(data.message);
                    onSuccess?.(data);
                },
                onError: (error: any) => {
                    console.log(error.response.data.message);
                    onError?.(error);
                }
            }
        );
    };

    const ForgotPassword = (
        email: string,
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        forgotPassword.mutate(
            email,
            {
                onSuccess: (data) => {
                    console.log(data.message);
                    onSuccess?.(data);
                },
                onError: (error: any) => {
                    console.log(error.response.data);
                    onError?.(error);
                }
            }
        );
    };

    const LogoutUser = (
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        logout.mutate(
            undefined,
            {
                onSuccess: (data) => {
                    console.log(data.message);
                    onSuccess?.(data);
                },
                onError: (error: any) => {
                    console.log(error.response.data.message);
                    onError?.(error);
                }
            }
        );
    };

    const UpdateProfile = (
        fullName: string,
        phone: string,
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        updateProfile.mutate(
            { FullName: fullName, Phone: phone },
            {
                onSuccess: (data) => {
                    console.log(data.message);
                    onSuccess?.(data);
                },
                onError: (error: any) => {
                    console.log(error.response.data.message);
                    onError?.(error);
                }
            }
        );
    };

    // Update profile with image support
    const UpdateProfileWithImage = (
        data: { fullName?: string; phone?: string; profileImage?: File },
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        const formData = new FormData();
        if (data.fullName) formData.append('FullName', data.fullName);
        if (data.phone) formData.append('Phone', data.phone);
        if (data.profileImage) formData.append('ProfileImage', data.profileImage);

        updateProfile.mutate(
            formData,
            {
                onSuccess: (response) => {
                    console.log(response.message);
                    onSuccess?.(response);
                },
                onError: (error: any) => {
                    console.log(error.response?.data?.message);
                    onError?.(error);
                }
            }
        );
    };

    // Delete profile image
    const DeleteProfileImage = (
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        deleteProfileImage.mutate(
            undefined,
            {
                onSuccess: (response) => {
                    console.log(response.message || 'Profile image deleted');
                    onSuccess?.(response);
                },
                onError: (error: any) => {
                    console.log(error.response?.data?.message);
                    onError?.(error);
                }
            }
        );
    };

    const GetUserProfile = (
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        if (!isError) {
            console.log("email :", profile.data.email);
            console.log("fullname :", profile.data.fullName);
            console.log("phone :", profile.data.phone);
            onSuccess?.(profile);
        } else {
            onError?.(error);
        }
    };

    const LoginUser = (
        email: string,
        password: string,
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        loginMutation.mutate(
            { email, password },
            {
                onSuccess: (data) => {
                    onSuccess?.(data);
                },
                onError: (error: any) => {
                    onError?.(error);
                }
            }
        );
    };

    const RegisterUser = (
        fullName: string,
        email: string,
        password: string,
        confirmPassword: string,
        phone: string,
        role: string,
        onSuccess?: (data: any) => void,
        onError?: (error: any) => void
    ) => {
        registerUser.mutate(
            { fullName, email, password, confirmPassword, phone, role },
            {
                onSuccess: (data) => {
                    console.log(data.message);
                    onSuccess?.(data);
                },
                onError: (error: any) => {
                    console.log(error.response.data.message);
                    onError?.(error);
                }
            }
        );
    };

    return {
        profile,
        isLoading,
        error,
        isError,
        ChangePassword,
        ResetPassword,
        ForgotPassword,
        LogoutUser,
        UpdateProfile,
        UpdateProfileWithImage,
        DeleteProfileImage,
        GetUserProfile,
        LoginUser,
        RegisterUser,
        isPending: {
            changePassword: changePassword.isPending,
            resetPassword: resetPassword.isPending,
            forgotPassword: forgotPassword.isPending,
            logout: logout.isPending,
            updateProfile: updateProfile.isPending,
            deleteProfileImage: deleteProfileImage.isPending,
            login: loginMutation.isPending,
            register: registerUser.isPending
        }
    };
};
