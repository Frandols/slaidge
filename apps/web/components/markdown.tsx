import Link from 'next/link'
import React, { memo } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeBlock } from './code-block'

const components: Partial<Components> = {
	// @ts-expect-error "not assignable"
	code: CodeBlock,
	pre: ({ children }) => <>{children}</>,
	ol: ({ children, ...props }) => {
		return (
			<ol
				className='list-decimal list-outside ml-4'
				{...props}
			>
				{children}
			</ol>
		)
	},
	li: ({ children, ...props }) => {
		return (
			<li
				className='py-1'
				{...props}
			>
				{children}
			</li>
		)
	},
	ul: ({ children, ...props }) => {
		return (
			<ul
				className='list-decimal list-outside ml-4'
				{...props}
			>
				{children}
			</ul>
		)
	},
	strong: ({ children, ...props }) => {
		return (
			<span
				className='font-semibold'
				{...props}
			>
				{children}
			</span>
		)
	},
	a: ({ children, ...props }) => {
		return (
			// @ts-expect-error "not assignable"
			<Link
				className='text-blue-500 hover:underline'
				target='_blank'
				rel='noreferrer'
				{...props}
			>
				{children}
			</Link>
		)
	},
	h1: ({ children, ...props }) => {
		return (
			<h1
				className='scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance'
				{...props}
			>
				{children}
			</h1>
		)
	},
	h2: ({ children, ...props }) => {
		return (
			<h2
				className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'
				{...props}
			>
				{children}
			</h2>
		)
	},
	h3: ({ children, ...props }) => {
		return (
			<h3
				className='scroll-m-20 text-2xl font-semibold tracking-tight'
				{...props}
			>
				{children}
			</h3>
		)
	},
	h4: ({ children, ...props }) => {
		return (
			<h4
				className='scroll-m-20 text-xl font-semibold tracking-tight'
				{...props}
			>
				{children}
			</h4>
		)
	},
	h5: ({ children, ...props }) => {
		return (
			<h5
				className='scroll-m-20 text-lg font-semibold tracking-tight'
				{...props}
			>
				{children}
			</h5>
		)
	},
	h6: ({ children, ...props }) => {
		return (
			<h6
				className='scroll-m-20 text-lg font-semibold tracking-tight'
				{...props}
			>
				{children}
			</h6>
		)
	},
}

const remarkPlugins = [remarkGfm]

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
	return (
		<ReactMarkdown
			remarkPlugins={remarkPlugins}
			components={components}
		>
			{children}
		</ReactMarkdown>
	)
}

export const Markdown = memo(
	NonMemoizedMarkdown,
	(prevProps, nextProps) => prevProps.children === nextProps.children
)
