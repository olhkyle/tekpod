import styled from '@emotion/styled';
import { TagsInput, TextArea, TextInput } from '../components';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { WriteSchema, writeSchema } from '../components/write/schema';
import { useState } from 'react';

export interface Tag {
	id: number;
	tag: string;
}

const Write = () => {
	const { register, control, formState, handleSubmit } = useForm<WriteSchema>({ resolver: zodResolver(writeSchema) });

	const [tags, setTags] = useState<Tag[]>([]);

	const onSubmit = (data: WriteSchema) => {
		console.log(data);
	};
	console.log(formState);
	return (
		<Container>
			<Header>
				<Title>✍🏻</Title>
			</Header>
			<Group onSubmit={handleSubmit(onSubmit)}>
				<TextInput id="title" {...register('title')} placeholder="﹡ Title" />
				<Controller
					name="content"
					control={control}
					render={({ field: { name, value, onChange, onBlur } }) => (
						<TextArea id="content" name={name} value={value} onChange={onChange} onBlur={onBlur} placeholder="→ What I did" />
					)}
				/>
				<TextInput id="feeling" {...register('feeling')} name="feeling" placeholder="💡 One Feeling" />
				<TagsInput tags={tags} setTags={setTags} />
				<button type="submit">업로드</button>
			</Group>
			<Preview></Preview>
		</Container>
	);
};

const Container = styled.section`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const Header = styled.div`
	display: flex;
	justify-content: space-between;
`;

const Title = styled.h2`
	font-size: var(--fz-h4);
	font-weight: var(--fw-black);
`;

const Group = styled.form`
	display: flex;
	flex-direction: column;
	gap: 16px;
`;

const Preview = styled.div``;

export default Write;
