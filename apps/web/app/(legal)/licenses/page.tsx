import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Licencias | Slaidge',
	description:
		'La app que te permite hacer tus presentaciones con inteligencia artificial y herramientas simplificadas.',
}

export default function LicensesPage() {
	return (
		<>
			<h1 className='text-3xl font-medium pb-6'>Licencias</h1>
			<p className='leading-relaxed'>
				1. Otorgamiento de Licencia
				<br /> Slaidge te otorga una licencia no exclusiva, intransferible y no
				sublicenciable para:
				<br />
				- Usar la App para crear y editar presentaciones personales o
				comerciales.
				<br />
				- Usar las funciones de IA para asistir en la generación o modificación
				de contenido.
				<br />
				<br /> 2. Restricciones
				<br /> No podés:
				<br />- Redistribuir la App como producto independiente.
				<br />- Quitar avisos de derechos de autor o marca.
				<br />- Usar la App en violación de leyes o derechos de terceros.
				<br />- Sub-licenciar, alquilar o transferir tu acceso.
				<br />
				<br /> 3. Propiedad Intelectual Todos los derechos sobre el software,
				marca y diseño pertenecen a los creadores de Slaidge. Esta licencia no
				transfiere propiedad.
				<br />
				<br /> 4. Garantías y Responsabilidad
				<br /> Slaidge se ofrece "tal cual", sin garantías de funcionamiento. No
				nos responsabilizamos por daños derivados del uso del software.
				<br />
				<br /> 5. Ley Aplicable Este acuerdo se rige por las leyes de la
				República Argentina.
				<br />
				<br /> Última actualización: 22 de julio de 2025.
			</p>
		</>
	)
}
