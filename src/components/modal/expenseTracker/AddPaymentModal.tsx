import styled from '@emotion/styled';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Session } from '@supabase/supabase-js';
import { ModalLayout, ModalDataType } from '..';
import { AddPaymentFormSchema, addPaymentFormSchema } from '.';
import { Button, CustomSelect, DatePicker, TextInput } from '../..';
import { addPayment } from '../../../supabase';
import { useLoading } from '../../../hooks';
import { paymentData, toastData, queryKey, installmentPlanMonths, cardType } from '../../../constants';
import { useToastStore } from '../../../store';
import { monetizeWithSeparator, today } from '../../../utils';

interface AddPaymentModalProps {
	id: string;
	type: ModalDataType;
	onClose: () => void;
}

const AddPaymentModal = ({ id, type, onClose }: AddPaymentModalProps) => {
	const queryClient = useQueryClient();
	const session = queryClient.getQueryData(['auth']) as Session;

	const {
		register,
		control,
		setValue,
		watch,
		handleSubmit,
		formState: { errors, touchedFields },
	} = useForm<AddPaymentFormSchema>({
		resolver: zodResolver(addPaymentFormSchema),
		defaultValues: { usage_date: today, priceIntegerPart: '', priceDecimalPart: '', installment_plan_months: null },
	});

	const { startTransition, Loading, isLoading } = useLoading();
	const { addToast } = useToastStore();

	const onSubmit = async (data: AddPaymentFormSchema) => {
		const currentTime = new Date().toISOString();

		try {
			await startTransition(
				addPayment({
					...data,
					user_id: session?.user?.id,
					usage_date: data?.usage_date.toISOString(),
					created_at: currentTime,
					updated_at: currentTime,
				}),
			);
			onClose();
			addToast(toastData.EXPENSE_TRACKER.CREATE.SUCCESS);
		} catch (e) {
			console.error(e);
			addToast(toastData.EXPENSE_TRACKER.CREATE.ERROR);
		} finally {
			queryClient.invalidateQueries({ queryKey: queryKey.EXPENSE_TRACKER });
		}
	};

	return (
		<ModalLayout id={id} type={type} title={'Add Payment'} onClose={onClose}>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column">
					<Controller
						name="usage_date"
						control={control}
						render={({ field: { value, onChange } }) => (
							<DatePicker
								selected={value}
								setSelected={(date: Date) => {
									onChange(date);
								}}
								error={errors['usage_date']}
								disabled={{ after: today }}
							/>
						)}
					/>

					<TextInput errorMessage={errors['place']?.message}>
						<TextInput.TextField type="text" id="place" {...register('place')} placeholder="Where to use" />
					</TextInput>

					<CustomSelect
						data={paymentData.paymentMethod}
						label={'payment_method'}
						placeholder={'Card / Cash'}
						currentValue={watch('payment_method')}
						isTriggered={!!touchedFields['payment_method']}
						error={errors['payment_method']}
						onSelect={data => {
							setValue('payment_method', data, { shouldValidate: true, shouldTouch: true });
						}}
					/>

					{watch('payment_method') === 'Card' && (
						<>
							<CustomSelect
								data={Object.values(cardType)}
								label={'card_type'}
								placeholder={'Select Card Type'}
								currentValue={watch('card_type')}
								isTriggered={!!touchedFields['card_type']}
								suffixWord={'(Card)'}
								error={errors['card_type']}
								onSelect={data => {
									setValue('card_type', data, { shouldValidate: true, shouldTouch: true });
								}}
							/>
							{watch('card_type') === cardType['신용'] && (
								<CustomSelect
									data={installmentPlanMonths}
									label={'installment_plan_months'}
									placeholder={'Select Installment Month'}
									currentValue={watch('installment_plan_months')}
									isTriggered={!!touchedFields['installment_plan_months']}
									suffixWord={watch('installment_plan_months') === 0 ? '➡️ one-time payment' : '- month'}
									error={errors['installment_plan_months']}
									onSelect={data => setValue('installment_plan_months', data, { shouldValidate: true, shouldTouch: true })}
								/>
							)}
						</>
					)}

					<CustomSelect
						data={paymentData.banks}
						label={'bank'}
						placeholder={'Select Bank'}
						currentValue={watch('bank')}
						isTriggered={!!touchedFields['bank']!}
						error={errors['bank']}
						onSelect={data =>
							setValue('bank', data, {
								shouldValidate: true,
								shouldTouch: true,
							})
						}
					/>

					<CustomSelect
						data={paymentData.priceUnits}
						label={'price_unit'}
						placeholder={'Unit'}
						currentValue={watch('price_unit')}
						isTriggered={touchedFields['price_unit']!}
						error={errors['price_unit']}
						onSelect={data => setValue('price_unit', data, { shouldValidate: true, shouldTouch: true })}
					/>

					<BottomFixedFlex direction="row">
						<Controller
							name="priceIntegerPart"
							control={control}
							render={({ field: { name, value, onChange, onBlur } }) => (
								<TextInput errorMessage={errors['priceIntegerPart']?.message}>
									<TextInput.ControlledTextField
										type="text"
										inputMode="numeric" // 모바일에서 숫자 키패드 표시
										id="priceIntegerPart"
										name={name}
										value={value ? monetizeWithSeparator(value) : ''}
										onChange={e => {
											const numericValue = e.target.value.replace(/[^0-9]/g, '');
											onChange(numericValue);
										}}
										onBlur={onBlur}
										placeholder="000"
									/>
								</TextInput>
							)}
						/>
						{watch('price_unit') !== 'WON' && watch('price_unit') !== 'JPY' && (
							<>
								<Point>.</Point>
								<Controller
									name="priceDecimalPart"
									control={control}
									render={({ field: { name, value, onChange, onBlur } }) => (
										<TextInput errorMessage={errors['priceDecimalPart']?.message}>
											<TextInput.ControlledTextField
												type="text"
												inputMode="numeric" // 모바일에서 숫자 키패드 표시
												id="priceDecimalPart"
												name={name}
												value={value ? value.toString() : ''}
												onChange={e => {
													const numericValue = e.target.value.replace(/[^0-9]/g, '');
													onChange(numericValue);
												}}
												onBlur={onBlur}
												maxLength={2}
												placeholder="00"
											/>
										</TextInput>
									)}
								/>
							</>
						)}
					</BottomFixedFlex>
				</Flex>

				<SubmitButton type="submit">{isLoading ? Loading : 'Add'}</SubmitButton>
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

const Flex = styled.div<{ direction: 'row' | 'column' }>`
	display: flex;
	flex-direction: ${({ direction }) => direction};
	gap: 8px;
	margin-top: 8px;
`;

const BottomFixedFlex = styled(Flex)`
	justify-content: space-between;
`;

const Point = styled.div`
	padding-top: 32px;
	font-size: 16px;
	font-weight: var(--fw-black);
`;

const SubmitButton = styled(Button)`
	margin-top: 16px;
	padding: var(--padding-container-mobile);
	width: 100%;
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
