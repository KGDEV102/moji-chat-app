import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Link, useNavigate } from 'react-router';
import { FieldDescription } from './ui/field';
import { useAuthStore } from '@/stores/useAuthStore';
const formSchema = z.object({
    firstname: z.string().nonempty('Họ không được để trống'),
    lastname: z.string().nonempty('Tên không được để trống'),
    username: z.string().min(3, 'username phải có ít nhất 3 kí tự'),
    email: z.email(),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
});
type form = z.infer<typeof formSchema>;
export function SignupForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<form>({ resolver: zodResolver(formSchema) });
    const signUp = useAuthStore(state => state.signUp);
    const navigate = useNavigate();
    const onSubmit = async (data: form) => {
        const { firstname, lastname, username, email, password } = data;
        await signUp({ firstname, lastname, username, email, password });
        navigate('/signin');
    };
    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className='overflow-hidden p-0'>
                <CardContent className='grid p-0 md:grid-cols-2'>
                    <div className='p-8 flex flex-col gap-4'>
                        {/* header & logo */}
                        <div className='flex flex-col gap-2 text-center justify-center items-center'>
                            <img src='/logo.svg' alt='logo' className='w-fit' />
                            <h1 className='text-2xl font-bold'>
                                Tạo tài khoản MOJI
                            </h1>
                            <p>Chào mừng bạn! Hãy đăng kí để bắt đầu</p>
                        </div>
                        {/* form */}
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className='flex flex-col gap-4 flex-starts'
                        >
                            {/* họ & tên */}
                            <div className='flex gap-2'>
                                <div className='flex flex-col gap-2'>
                                    <Label>Họ</Label>
                                    <Input {...register('firstname')} />
                                    {errors.firstname && (
                                        <p className='text-destructive text-sm'>
                                            {errors.firstname.message}
                                        </p>
                                    )}
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label>Tên</Label>
                                    <Input {...register('lastname')} />
                                    {errors.lastname && (
                                        <p className='text-destructive text-sm'>
                                            {errors.lastname.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {/* Tên đăng nhập */}
                            <div className='flex flex-col gap-2'>
                                <Label>Tên đăng nhập</Label>
                                <Input
                                    placeholder='moji'
                                    {...register('username')}
                                />
                                {errors.username && (
                                    <p className='text-destructive text-sm'>
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>
                            {/* Email */}
                            <div className='flex flex-col gap-2'>
                                <Label>Email</Label>
                                <Input
                                    placeholder='nguyenvana@gmail.com'
                                    type='email'
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <p className='text-destructive text-sm'>
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            {/* Mật khẩu */}
                            <div className='flex flex-col gap-2'>
                                <Label>Mật khẩu</Label>
                                <Input
                                    type='password'
                                    {...register('password')}
                                />
                                {errors.password && (
                                    <p className='text-destructive text-sm'>
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                            {/* Button */}
                            <Button type='submit' disabled={isSubmitting}>
                                Tạo tài khoản
                            </Button>
                        </form>
                        <p className='text-center '>
                            Đã có tài khoản?{' '}
                            <Link to={'/signin'} className='underline'>
                                Đăng nhập
                            </Link>
                        </p>
                    </div>
                    <div className='bg-muted relative hidden md:block'>
                        <img
                            src='/placeholderSignUp.png'
                            alt='Image'
                            className='absolute inset-0 h-full w-full object-cover '
                        />
                    </div>
                </CardContent>
            </Card>
            <FieldDescription className='px-6 text-center'>
                Bằng cách tiếp tục, bạn đồng ý với{' '}
                <a href='#'>Chính sách dịch vụ</a> và{' '}
                <a href='#'>Chính sách bảo mật</a>. của chúng tôi
            </FieldDescription>
        </div>
    );
}
