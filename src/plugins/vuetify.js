import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives' // 💡 보통 directives도 함께 임포트해서 설정한다!

export default createVuetify(
    {
        theme:{
            dark: true,
        },
        components,
        directives
    }
)
