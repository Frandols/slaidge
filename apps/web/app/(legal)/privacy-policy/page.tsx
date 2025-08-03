import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Política de privacidad | Slaidge',
	description:
		'La app que te permite hacer tus presentaciones con inteligencia artificial y herramientas simplificadas.',
}

export default function PrivacyPolicyPage() {
	return (
		<>
			<h1 className='text-3xl font-medium pb-6'>Politica de Privacidad</h1>
			<p className='leading-relaxed'>
				Tu privacidad es importante para nosotros. Esta Política explica cómo
				recopilamos, usamos y protegemos tu información personal al utilizar
				Slaidge.
				<br />
				<br /> 1. Información que recopilamos
				<br /> Solicitamos información personal únicamente cuando es necesaria
				para brindarte nuestros servicios. Por ejemplo, si inicias sesión con tu
				cuenta de Google, podremos acceder a tu nombre, dirección de correo
				electrónico y foto de perfil.
				<br />
				<br /> 2. Uso de la información
				<br /> Usamos la información recopilada únicamente para:
				<br /> - Mostrar tus datos dentro de Slaidge
				<br /> - Personalizar la experiencia de usuario
				<br /> - Brindarte acceso a las funcionalidades de Slaidge
				<br />
				<br /> 3. Conservación y protección de datos
				<br /> Guardamos la información solo el tiempo necesario para prestar el
				servicio. Protegemos tus datos con medidas técnicas y organizativas
				razonables contra acceso no autorizado, divulgación o modificación.
				<br />
				<br /> 4. Divulgación a terceros
				<br /> No compartimos tu información personal con terceros, salvo
				obligación legal.
				<br />
				<br /> 5. Servicios externos
				<br /> Slaidge puede contener enlaces a sitios externos (como Google).
				No somos responsables del contenido ni de las políticas de privacidad de
				estos servicios.
				<br />
				<br /> 6. Derechos del usuario
				<br /> Podés solicitar la eliminación de tu cuenta y datos en cualquier
				momento escribiéndonos al correo indicado más abajo.
				<br />
				<br /> 7. Base legal Actuamos como controlador y procesador de datos
				conforme al Reglamento General de Protección de Datos (GDPR) y demás
				leyes aplicables. Tu uso continuo de Slaidge implica tu aceptación de
				esta política.
				<br />
				<br /> Última actualización: 22 de julio de 2025.
			</p>
		</>
	)
}
