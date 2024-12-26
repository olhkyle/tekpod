import styled from '@emotion/styled';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalLayout from '../ModalLayout';
import { ModalDataType } from '../modalType';
import { AddPaymentFormSchema, addPaymentFormSchema } from './addPaymentFormSchema';
import { Button, CustomSelect, DatePicker, TextInput } from '../../common';
import { paymentData } from '../../../constants/financialLedger';

interface AddPaymentModalProps {
	id: string;
	type: ModalDataType;
	onClose: () => void;
}

/**
 *
 * 날짜 - DatePicker
 * 사용처 - TextInput
 * 은행(카드 or 현금) - Select + Select
 * 금액 - TextInput
 */

const AddPaymentModal = ({ id, type, onClose }: AddPaymentModalProps) => {
	const {
		register,
		control,
		setValue,
		watch,
		handleSubmit,
		formState: { errors, touchedFields },
	} = useForm<AddPaymentFormSchema>({
		resolver: zodResolver(addPaymentFormSchema),
	});
	console.log(errors);

	const onSubmit = async (data: unknown) => {
		console.log(data);
	};

	return (
		<ModalLayout id={id} type={type} title={'Add Payment'} onClose={onClose}>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Flex>
					<DatePicker
						selected={watch('selectedDate')}
						setSelected={(date: Date) => setValue('selectedDate', date, { shouldValidate: true })}
						error={errors['selectedDate']}
					/>

					<TextInput errorMessage={errors['place']?.message}>
						<TextInput.TextField type="text" id="place" {...register('place')} placeholder="Where to use" />
					</TextInput>

					<Controller
						name="price"
						control={control}
						render={({ field: { name, value, onChange, onBlur } }) => (
							<TextInput errorMessage={errors['price']?.message}>
								<TextInput.ControlledTextField
									type="text"
									inputMode="numeric" // 모바일에서 숫자 키패드 표시
									id="price"
									name={name}
									value={
										value
											? value
													.toString()
													.replace(/,/gi, '')
													.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
											: ''
									}
									onChange={e => {
										const numericValue = e.target.value.replace(/[^0-9]/g, '');
										onChange(numericValue);
									}}
									onBlur={onBlur}
									placeholder="Price to Pay"
								/>
							</TextInput>
						)}></Controller>

					<CustomSelect
						data={paymentData.paymentMethod}
						target_id={'payment_method'}
						placeholder={'Card / Cash'}
						currentValue={watch('payment_method')}
						isTriggered={touchedFields['payment_method']!}
						error={errors['payment_method']}
						onSelect={data => setValue('payment_method', data, { shouldValidate: true, shouldTouch: true })}
					/>

					<CustomSelect
						data={paymentData.banks}
						target_id={'bank'}
						placeholder={'Select Bank'}
						currentValue={watch('bank')!}
						isTriggered={touchedFields['bank']!}
						error={errors['bank']}
						onSelect={data => setValue('bank', data, { shouldValidate: true, shouldTouch: true })}
					/>
				</Flex>

				<SubmitButton type="submit">추가하기</SubmitButton>
			</Form>
		</ModalLayout>
	);
};

const Form = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 8px;
	height: 100%;
`;

const Flex = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const SubmitButton = styled(Button)`
	padding: var(--padding-container-mobile);
	width: 100%;
	min-height: 57px;
	color: var(--white);
	background-color: var(--black);
	font-size: var(--fz-p);
	font-weight: var(--fw-semibold);

	&:active,
	&:focus {
		background-color: var(--greyOpacity900);
	}

	&:disabled {
		background-color: var(--greyOpacity400);
	}
`;

export default AddPaymentModal;
