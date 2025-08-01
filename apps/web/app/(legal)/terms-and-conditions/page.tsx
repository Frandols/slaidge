import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Terminos y condiciones | Slaidge',
	description:
		'Slaidge que te permite hacer tus presentaciones con inteligencia artificial y herramientas simplificadas.',
}

export default function TermsAndConditionsPage() {
	return (
		<>
			<h1 className='text-3xl font-medium pb-6'>Terminos y Condiciones</h1>
			<p className='leading-relaxed'>
				1. Introducción
				<br /> Al utilizar esta aplicación Slaidge confirmas tu aceptación y te
				comprometes a cumplir estos términos y condiciones.
				<br />
				<br /> 2. Aceptación del Acuerdo
				<br /> Este acuerdo entra en vigor desde el momento en que utilizas por
				primera vez Slaidge. Si no estás de acuerdo con estos términos, no
				deberías usar Slaidge.
				<br />
				<br /> 3. Licencia de Uso de Software
				<br /> Slaidge se otorga bajo una licencia de uso personal y no
				transferible. Puedes usarla para crear, editar y mejorar presentaciones
				de Google Slides a través de una interfaz simplificada y herramientas de
				inteligencia artificial. Nos reservamos el derecho de suspender o
				revocar el acceso a Slaidge en cualquier momento, sin previo aviso, en
				caso de mal uso o violación de estos términos.
				<br />
				<br /> 4. Uso de la API de Google Slides
				<br /> Slaidge actúa como intermediaria entre el usuario y la API
				oficial de Google Slides. No almacena de forma permanente tus
				presentaciones ni actúa como proveedor oficial de Google. El uso de
				Slaidge debe cumplir con los Términos de Servicio de Google y las
				Políticas de uso de la API de Google Slides.
				<br />
				<br /> 5. Reembolsos
				<br /> Dado que se trata de un producto digital con acceso inmediato a
				funcionalidades, no se admiten reembolsos una vez otorgado el acceso.
				<br />
				<br /> 6. Renuncia de Garantías
				<br /> No garantizamos que Slaidge cumpla con tus expectativas o que
				funcione sin interrupciones o errores. El uso de Slaidge es bajo tu
				propio riesgo.
				<br />
				<br /> 7. Limitación de Responsabilidad
				<br /> Slaidge no será responsable por pérdidas indirectas, daños
				incidentales o cualquier perjuicio derivado del uso del software,
				incluyendo pérdida de datos o interrupciones de servicio.
				<br />
				<br /> 8. Contenido Generado por el Usuario
				<br /> Eres responsable del contenido que generas, cargas o modificas a
				través de Slaidge. Nos reservamos el derecho a eliminar contenido que
				infrinja derechos de terceros o normas legales.
				<br />
				<br /> 9. Cambios de Precio
				<br /> Nos reservamos el derecho de modificar los precios en cualquier
				momento. El uso continuado después de cualquier ajuste de precio implica
				la aceptación del nuevo valor.
				<br />
				<br /> 10. Legislación Aplicable
				<br /> Este Acuerdo se rige por las leyes de la República Argentina. En
				caso de disputa, las partes se someterán a la jurisdicción de los
				tribunales competentes de la Ciudad de Buenos Aires.
				<br />
				<br /> Última actualización: 22 de julio de 2025.
			</p>
		</>
	)
}
