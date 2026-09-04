import { defineComponent } from 'vue'

export const DetailHeader = defineComponent({
  name: 'DetailHeader',
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div class="flex bg-gray-50 text-sm">
        <div class="flex w-[100px] shrink-0 items-center justify-end border-r border-solid border-gray-100 px-2 py-1 font-semibold">
          {props.label}
        </div>
        <div class="flex flex-grow items-center px-2 py-1 font-semibold">{props.value}</div>
      </div>
    )
  },
})
