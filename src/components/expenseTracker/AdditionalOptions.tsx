import styled from '@emotion/styled';
import { MdOutlineAdd } from 'react-icons/md';
import { RiArrowRightSLine } from 'react-icons/ri';
import { formatByKoreanTime, today } from '../../utils';
import { ShrinkMotionBlock } from '../common';
import { useState } from 'react';
import { customPropReceiver, queryKey, routes, toastData } from '../../constants';
import { addPayment, ExpenseTracker } from '../../supabase';
import { useClientSession, useLoading } from '../../hooks';
import { useToastStore } from '../../store';
import { useNavigate } from 'react-router-dom';

interface AdditionalOptionsProps {
	payment: ExpenseTracker;
}

const AdditionalOptions = ({
	payment: { bank, card_type, installment_plan_months, payment_method, place, price, price_unit },
}: AdditionalOptionsProps) => {
	const { queryClient, session } = useClientSession();
	const { startTransition, Loading, isLoading } = useLoading();
	const { addToast } = useToastStore();
	const navigate = useNavigate();

	const [isOpen, setIsOpen] = useState(false);

	const handleAddSameExpense = async () => {
		const currentTime = new Date().toISOString();

		try {
			await startTransition(
				addPayment({
					bank,
					card_type,
					installment_plan_months,
					payment_method,
					place,
					price,
					price_unit,
					user_id: session?.user?.id,
					usage_date: currentTime,
					created_at: currentTime,
					updated_at: currentTime,
				}),
			);

			navigate(routes.EXPENSE_TRACKER_BY_MONTH, { state: { currentDate: currentTime }, replace: true });
			addToast(toastData.EXPENSE_TRACKER.CREATE.SUCCESS);
		} catch (e) {
			console.error(e);
			addToast(toastData.EXPENSE_TRACKER.CREATE.ERROR);
		} finally {
			queryClient.invalidateQueries({ queryKey: queryKey.EXPENSE_TRACKER });
		}
	};

	return (
		<Container>
			<OptionsExpandTrigger onClick={() => setIsOpen(isOpen => !isOpen)}>
				<span>Options</span>
				<RotatableSvg size="21" color="var(--black)" $isOpen={isOpen} />
			</OptionsExpandTrigger>
			<OptionsList isOpen={isOpen}>
				<li>
					<Option onClick={handleAddSameExpense}>
						<MdOutlineAdd size="18" color="var(--black)" />
						<span>{isLoading ? Loading : `Add same expense info on ${formatByKoreanTime(today)}`} </span>
					</Option>
				</li>
			</OptionsList>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: var(--padding-container-mobile);
	background-color: var(--greyOpacity50);
	border: 1px solid var(--grey100);
	border-radius: var(--radius-m);
	cursor: pointer;
`;

const OptionsExpandTrigger = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;

	span {
		font-weight: var(--fw-medium);
		color: var(--grey800);
	}
`;

const RotatableSvg = styled(RiArrowRightSLine, customPropReceiver)<{ $isOpen: boolean }>`
	transform: ${({ $isOpen }) => ($isOpen ? 'rotate(90deg)' : 'rotate(0deg)')};
	transition: transform 0.1s ease-in-out;
`;

const OptionsList = styled.div<{ isOpen: boolean }>`
	display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
	flex-direction: column;
	gap: 16px;
	height: ${({ isOpen }) => (isOpen ? '100%' : '0')};
	transition: height 0.15s ease-in-out, display 0.3s ease-in-out;
`;

const Option = styled(ShrinkMotionBlock)`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: var(--padding-container-mobile);
	border: 1px solid var(--grey200);
	border-radius: var(--radius-s);
	color: var(--black);
	background-color: var(--grey200);

	span {
		font-weight: var(--fw-medium);
	}
`;

export default AdditionalOptions;
