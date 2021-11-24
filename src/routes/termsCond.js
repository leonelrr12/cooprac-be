const termsCond = require('express').Router()

TITLE = 'Términos y condiciones';
SECTIONS = 
[
    {
        TITLE: 'Aviso de privacidad',
        CONTENT: [
        'El siguiente Aviso de privacidad protege tu información personal de acuerdo la Ley de Panamá. Esta Aviso de privacidad explica cómo recolectamos y usamos algunos de tus datos personales y patrimoniales, así como las medidas de control y prevención tomados para asegurar que tu información esté segura y permanezca confidencial. De aquí en adelante se usará el nombre Finanservs.com para referirse a ambas partes.'
        ]
    }, 
    { 
        TITLE: 'Responsable',
        CONTENT: [
        'En cumplimiento con la Ley de Panamá, Finanservs.com., (en adelante “Finanservs.com”) te informa que Finanservs.com es responsable de la recolección, utilización, almacenamiento, comunicación y protección de tus datos personales.', 
        'El Usuario podrá contactar a Finanservs.com en cualquier momento a través del correo electrónico info@finanservs.com, para el ejercicio de sus derechos. Finanservs.com protege y salvaguarda tus datos personales para evitar el daño, pérdida, destrucción, robo, extravío, alteración o tratamiento no autorizado de los mismos.'
        ]
    }, 
    {
        TITLE: 'Información personal',
        CONTENT: [
        'La información personal solicitada al usuario está compuesta por los siguientes rubros: nombre(s), apellido(s), fecha de nacimiento, sexo, correo electrónico, teléfono fijo, teléfono celular, domicilio, provincia, distrito, corregimiento, calle, número de casa interior, país, ingreso mensual, información patrimonial, datos médicos, nombre de la empresa donde labora, ingresos, referencias personales, entre otros.',
        'Tus datos personales serán tratados con base en los principios de licitud, consentimiento, información, calidad, finalidad, lealtad, proporcionalidad y responsabilidad de la Legislación.',
        'Finanservs.com mantendrá la confidencialidad de tus datos personales estableciendo y manteniendo de forma efectiva las medidas de seguridad administrativas, técnicas y físicas, para evitar su daño, pérdida, alteración, destrucción, uso, acceso o divulgación indebida.',
        'La información deberá ser veraz y completa. El usuario responderá en todo momento por los datos proporcionados y en ningún caso Finanservs.com será responsable de la veracidad de los mismos.'
        ]
    }, 
    {
        TITLE: 'Uso de los datos personales',
        CONTENT: [
        'Tus datos personales serán usados para:',
        `
            <ul class="terms-list">
            <li>Prestar el servicio de asesoría, comparación, simulación y cálculo de cotizaciones de productos financieros, seguros y de inmuebles.</li>
            <li>El enlace con instituciones bancarias o entidades financieras generales, aseguradoras, brokers hipotecarios y/o inmobiliarios, desarrolladores inmobiliarios y entidades de investigación crediticia.</li>
            </ul>
        `,
        'De igual manera estos datos serán utilizados para:',
        `
            <ul class="terms-list">
            <li>Procurar un servicio eficiente.</li>
            <li>Informarte sobre cambios o nuevos servicios que estén relacionados con el producto o servicio solicitado.</li>
            <li>Dar cumplimiento a obligaciones contraídas con los usuarios.</li>
            <li>Evaluar la calidad de nuestro servicio.</li>
            </ul>
        `
        ]
    }, 
    {
        TITLE: 'Limitación de usos y divulgación de los datos personales',
        CONTENT: [
        'En nuestro programa de notificación de promociones, correo electrónico de noticias, blog, ofertas y servicios a través de correo electrónico, solo Finanservs.com tiene acceso a la información recabada. Este tipo de publicidad y comunicación se realiza mediante avisos y mensajes promocionales de correo electrónico, los cuales sólo serán enviados a ti y a los contactos registrados para tal propósito. La suscripción a este servicio podrá modificarse en cualquier momento escribiendo info@finanservs.com. En los correos electrónicos enviados pueden incluirse, ocasionalmente, ofertas de terceras partes que sean nuestros socios comerciales.'
        ]
    }, {
        TITLE: '¿Qué son las cookies y cómo se utilizan?',
        CONTENT: [
        'Las cookies son pequeñas piezas de información que son enviadas por el sitio web a tu navegador y se almacenan en el disco duro de tu equipo. Se utilizan para determinar tus preferencias cuando te conectas a los servicios de nuestros sitios, así como para rastrear determinados comportamientos o actividades llevadas a cabo por ti dentro del portal.',
        'Existen secciones de la página web en las que requerimos que el usuario tenga habilitadas las cookies, ya que algunas de las funcionalidades del sitio web las necesitan para trabajar.',
        'Las cookies nos permiten:',
        `
            <ul class="terms-list">
            <li>Reconocerte al momento de entrar a nuestros sitios y ofrecer de una experiencia personalizada.</li>
            <li>Conocer la configuración personal del sitio especificada por ti, ejemplo, esto nos ayuda a recordar tus datos personales ingresados para que no tengas que volver a escribirlos en cada ocasión.</li>
            <li>Calcular el tamaño de nuestra audiencia y medir algunos parámetros de tráfico.</li>
            <li>Evaluar la calidad de nuestro servicio.</li>
            </ul>
        `,
        'Cada navegador que obtiene acceso a nuestros sitios adquiere una cookie que se usa para determinar la frecuencia de uso y las secciones de los sitios visitadas, reflejando así hábitos y preferencias, información que nos es útil para mejorar el contenido, los titulares y las promociones para los usuarios.',
        'Las cookies también nos ayudan a rastrear algunas actividades. Por ejemplo, en algunas de las encuestas que lanzamos en línea podemos utilizar cookies para detectar si el usuario ya ha llenado la encuesta y evitar desplegarla nuevamente.',
        'Las cookies te permitirán tomar ventaja de las características que te ofrecemos, por lo que te recomendamos mantenerlas activas.',
        'Las cookies no serán utilizadas para identificar a los usuarios, con excepción de los casos en que se investiguen posibles actividades fraudulentas.',
        'ACsoraT, S. A. titular del portal Finanservs.com almacena automáticamente los datos del usuario, por ejemplo, cuando se registra en el portal o cuando contacta a la sociedad ya sea personalmente o respondiendo a preguntas por correo, fax, a través del portal o por teléfono.'
        ]
    }, {
        TITLE: 'Para revocar consentimiento otorgado',
        CONTENT: [
        'Como titular de datos personales, el usuario podrá ejercitar la revocación y el consentimiento que haya otorgado a Finanservs.com para el tratamiento de sus datos personales, enviando directamente su solicitud a info@finanservs.com',
        'Dicha solicitud deberá contener por lo menos: (a) nombre y domicilio u otro medio para comunicar la respuesta a tu solicitud; (b) los documentos que acrediten identidad o, en su caso, representación legal; (c) la descripción clara y precisa de los datos personales respecto de los que se solicita ejercer alguno de los derechos de revocación, (d) la manifestación expresa para revocar el consentimiento del tratamiento de tus datos personales y por tanto, darlos de baja para que no se usen; (d) cualquier otro elemento que facilite la localización de los datos personales.',
        'La petición deberá ir acompañada de los fundamentos por los que se solicita dicha revocación y una identificación oficial del titular de los datos o de su apoderado.',
        'En un plazo máximo de 20 (veinte) días hábiles atenderemos la solicitud e informaremos sobre la procedencia de la misma a través del correo electrónico del que provenga la petición. Finanservs.com solicita al usuario que actualice sus datos cada vez que éstos sean modificados, ya que esto permitirá brindarle un servicio eficiente y personalizado.'
        ]
     }, {
        TITLE: 'Transferencia de Información con Terceros',
        CONTENT: [
        'Los datos solicitados son indispensables para que Finanservs.com le proporcione el servicio en cuestión, por lo que de no contar con los mismos, la sociedad se encuentra materialmente imposibilitada de cumplir el fin principal de la relación con sus usuarios.',
        'Finanservs.com únicamente realiza transferencia de datos para cumplir con las obligaciones contraídas con los clientes o usuarios, permitiendo el acceso a la información a:',
        `
            <ul class="terms-list">
            <li>Compañías asociadas que tengan una relación comercial con Finanservs.com, así como sucursales de ACsoraT, S. A.</li>
            <li>Conocer la configuración personal del sitio especificada por ti, ejemplo, esto nos ayuda a recordar tus datos personales ingresados para que no tengas que volver a escribirlos en cada ocasión.</li>
            <li>Terceros cuyos productos o servicios aparezcan en nuestro sitio web y otorguen un servicio/producto solicitado por el usuario. Estos terceros tienen un control parcial de estos datos. Es importante que leas sus avisos de privacidad o los contactes directamente para información adicional.</li>
            <li>Agencias de interferencia de fraudes para detectar fraudes y lavado de dinero, en caso de que información falsa o poco precisa haya sido otorgada.</li>
            </ul>
        `
        ]
    }, {
        TITLE: 'Protección',
        CONTENT: [
        'ACsoraT, S. A., titular del portal Finanservs.com ha adoptado medidas de seguridad administrativas, técnicas y físicas que permiten proteger los datos personales que sus usuarios proporcionan contra daño, pérdida, alteración, destrucción o su uso, acceso y/o tratamiento no autorizado. Asimismo, nuestro personal está debidamente capacitado para tratar los datos personales en el mayor marco de confidencialidad, privacidad, secrecía y absoluto cumplimiento de la Ley de Panamá.',
        'Queda expresamente señalado que el servicio de asesoría, comparación, simulación, cálculo y cotización de productos financieros y seguros que presta Finanservs.com, lo hace de forma estimada con base en la información publicada por las instituciones financieras y de seguros, por lo que se pueden presentar cambios sin previo aviso. ACsoraT, S. A. no es responsable de cerciorarse o comprobar la veracidad de la información proporcionada por las diversas instituciones financieras y de seguros, así como por instituciones gubernamentales; tampoco es responsable de asegurarse del cumplimiento de estas últimas de los ofrecimientos presentados en sus cotizaciones. Los resultados que su comparador arroja son para fines meramente ilustrativos.'
        ]
    }, {
        TITLE: 'Cambios en el aviso de privacidad',
        CONTENT: [
        'Nos reservamos el derecho de efectuar en cualquier momento modificaciones o actualizaciones al presente aviso de privacidad, para la atención de novedades legislativas o jurisprudenciales, políticas internas, nuevos requerimientos para la prestación u ofrecimiento de nuestros servicios o productos y prácticas del mercado.',
        'Las referidas modificaciones o actualizaciones serán publicadas y puestas a disposición del público a través del portal Finanservs.com, sección Aviso de privacidad.'
        ]
    }, {
        TITLE: 'Autoridad',
        CONTENT: [
        'Si el usuario considera que han sido vulnerados sus derechos respecto de la protección de datos personales, tiene el derecho de acudir a la autoridad correspondiente para defender su ejercicio. La autoridad de protección al consumidor y defensa de la competencia, su sitio web es: <a class="terms-links" href="#">acodeco.gob.pa</a>'
        ]
    }, {
        TITLE: 'Aceptación de los términos',
        CONTENT: [
        'Este Aviso de Privacidad está sujeto a los términos y condiciones del sitio web de Finanservs.com antes descrito, lo cual constituye un acuerdo legal entre el usuario y ACsoraT, S. A.',
        'Si el usuario utiliza los servicios en el sitio web de Finanservs.com significa que ha leído, entendido, acordado y manifestado la voluntad de apegarse a los términos y condiciones expuestos en el Aviso de Privacidad y en el aviso legal.'
        ]
    }, {
        TITLE: 'Mejorar nuestros servicios',
        CONTENT: [
        'Para asegurarnos de que los servicios que ofrecemos cumplen con las necesidades de nuestro público, Finanservs.com podría llegar a solicitar retroalimentación. Cualquier retroalimentación que nos proporciones será utilizada únicamente para mejorar nuestros servicios y no será revelada en el sitio web de la empresa.'
        ]
    }, {
        TITLE: 'Seguridad',
        CONTENT: [
        'La seguridad de tu información es muy importante para nosotros. Nuestro sitio web está respaldado por nuestro certificado de seguridad SSL, ofreciendo un alto grado de protección. Cabe mencionar que no toda transmisión de datos a través de internet es 100% segura. Información altamente sensible, como los detalles de tu tarjeta de crédito, es encriptada para minimizar los peligros de intercepción durante el tránsito. Mientras que nosotros hacemos todo lo posible para proteger los datos personales que se nos proporcionan, éstos se nos otorgan con plena consciencia de los riesgos anteriores. Los Términos y Condiciones explican, adicionalmente, tu obligación de mantener seguro cualquier nombre de usuario y contraseña que utilices para registrarte a cualquiera de nuestros servicios.'
        ]
    }, {
        TITLE: 'Responsabilidad',
        CONTENT: [
        'Puede llegar a solicitarse un proceso de registro como parte del uso de esta plataforma. El proceso puede incluir la creación de un nombre de usuario y una contraseña. Es de suma importancia que no compartas tu nombre de usuario y contraseña con nadie. Si decides compartir tu nombre de usuario y contraseña con cualquier persona, solo tú eres responsable de todas las actividades llevadas a cabo en este sitio Web bajo tu nombre de usuario y contraseña.'
        ]
    }
]
CONTACT = 
[
    {
        TITLE: 'Contáctanos si tienes preguntas',
        CONTENT: 'Si tienes alguna pregunta o comentario acerca de este Aviso de Privacidad, contáctanos a través de: <a class="terms-links" href="mailto:info@finanservs.com">info@finanservs.com</a>'
    }, {
        TITLE: 'Darse de baja de la lista de contactos',
        CONTENT: 'Puede darse de baja de nuestros correos electrónicos promocionales a través del enlace <spam class="terms-links">Darse de baja</spam> que figura en cada correo electrónico o bien escribiéndonos a <a class="terms-links" href="mailto:info@finanservs.com">info@finanservs.com</a>'
    }
]


termsCond.get('/', (req, res) => {
    res.render('pages/privacidad', { TITLE, SECTIONS, CONTACT });
})

module.exports = termsCond