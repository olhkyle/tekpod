import { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { RiCloseFill } from 'react-icons/ri';
import { FiHash } from 'react-icons/fi';
import { Button } from '.';

export interface Tag {
	id: number;
	tag: string;
}

interface TagsInputProps {
	tags: Tag[];
	onChange: (tags: Tag[]) => void;
}

const TagsInput = ({ tags, onChange }: TagsInputProps) => {
	const [value, setValue] = useState<string>('');
	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleAddTag = (newTag: string) => {
		const trimmedValue = newTag.trim();
		if (trimmedValue === '') return;

		onChange([
			...tags,
			{
				id: Math.max(...tags.map(({ id }) => id), 0) + 1,
				tag: trimmedValue,
			},
		]);
	};

	const handleRemoveTag = (removeId: number) => {
		onChange(tags.filter(({ id }) => id !== removeId));
	};

	return (
		<Container>
			{tags.map(({ id, tag }) => (
				<Tag key={`${tag}_${id}`}>
					<FiHash size="16" />
					<span>{`${tag}`}</span>
					<Button type="button" onClick={() => handleRemoveTag(id)}>
						<RiCloseFill size="16" color="var(--black)" />
					</Button>
				</Tag>
			))}
			<Input
				type="text"
				value={value}
				onChange={e => setValue(e.target.value)}
				onKeyDown={e => {
					if (e.nativeEvent.isComposing) return;
					if (e.key !== 'Enter') return;

					e.preventDefault();

					handleAddTag(value);
					setValue('');
					inputRef.current?.focus();
				}}
				placeholder="# 태그"
			/>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: var(--padding-container-mobile);
	width: 100%;
	min-height: 65px;
	border: 1px solid var(--greyOpacity200);
	overflow-x: scroll;
`;

const Tag = styled.div`
	display: inline-flex;
	flex-wrap: nowrap;
	white-space: nowrap;
	justify-content: space-between;
	align-items: center;
	gap: 4px;
	padding: calc(var(--padding-container-mobile) / 4) calc(var(--padding-container-mobile) / 2);
	color: var(--white);
	background-color: var(--black);
	font-weight: var(--fw-semibold);
	border-radius: var(--radius-s);

	button {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		margin-left: 2px;
		min-width: 18px;
		height: 18px;
		background-color: var(--grey200);
		border-radius: var(--radius-xs);
		font-size: var(--fz-p);
	}
`;

const Input = styled.input`
	margin-left: 8px;
	min-width: 80px;
	flex-shrink: 0;
	width: 100%;
	font-size: var(--fz-p);
`;

export default TagsInput;
