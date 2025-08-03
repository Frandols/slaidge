'use client'

import { useRouter } from 'next/navigation'
import { ChangeEvent, useRef, useState } from 'react'
import { toast } from 'sonner'

import ConnectYourAccountDialog from '@/components/connect-your-account-dialog'
import TextPrompt from '@/components/text-prompt'
import createPresentation from '@/services/create-presentation'
import { fa } from 'zod/v4/locales'

interface CreatePresentationPromptProps extends React.PropsWithChildren {
	creditBalance?: number
}

export default function CreatePresentationPrompt(
	props: CreatePresentationPromptProps
) {
	const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false)

	const showDialog = () => {
		setIsDialogVisible(true)
	}

	const abortControllerRef = useRef<AbortController | null>(null)
	const navigation = useRouter()

	const [text, setText] = useState<string>('')
	const [submitting, setSubmitting] = useState<boolean>(false)

	const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		const newText = event.currentTarget.value

		setText(newText)
	}

	const onSubmit = async () => {
		setSubmitting(true)

		const abortController = new AbortController()

		abortControllerRef.current = abortController

		const creatingPresentationToastId = toast.loading(
			'Creando la presentación...'
		)

		try {
			const result = await createPresentation(text, abortController)

			toast.success('¡Se creó la presentación exitosamente!')

			navigation.push(`/presentations/${result.presentationId}`)
		} catch (error) {
			if (!(error instanceof Error)) return

			if (error.message === 'UNAUTHENTICATED') {
				showDialog()

				return
			}

			if (error.message === 'signal is aborted without reason') {
				toast.success('Se frenó la creación')

				return
			}

			toast.error('Lo sentimos, ocurrió un error al crear la presentación')
		} finally {
			setSubmitting(false)
			toast.dismiss(creatingPresentationToastId)
		}

		setSubmitting(false)
	}

	const onStop = () => {
		setSubmitting(false)

		if (!abortControllerRef.current) return

		abortControllerRef.current.abort()
	}

	return (
		<>
			<ConnectYourAccountDialog
				open={isDialogVisible}
				onOpenChange={setIsDialogVisible}
			>
				Necesitamos poder agregar las presentaciones que crees a tu
				almacenamiento de Google Slides.
			</ConnectYourAccountDialog>
			<TextPrompt
				value={text}
				onChange={onChange}
				onSubmit={onSubmit}
				showStop={false}
				disabled={submitting}
				onStop={onStop}
				placeholder='Crea una presentacion sobre '
				placeholders={[
					'la inteligencia artificial en la vida cotidiana',
					'la importancia del reciclaje',
					'la historia de Internet',
					'cómo funciona el sistema solar',
					'el impacto del ejercicio en la salud mental',
					'la evolución de los videojuegos',
					'la alimentación saludable en adolescentes',
					'el cambio climático y sus consecuencias',
					'la invención de la imprenta',
					'la comunicación no verbal en los animales',
				]}
				creditBalance={props.creditBalance}
			>
				{props.children}
			</TextPrompt>
		</>
	)
}
