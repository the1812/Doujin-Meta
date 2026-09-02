import { defineComponent } from 'vue'

export const DetailRow = defineComponent({
  name: 'DetailRow',
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
      <div class="flex text-sm">
        <div class="flex w-[100px] shrink-0 items-center justify-end border-r border-solid border-gray-200 bg-gray-100 px-2 py-1">
          {props.label}
        </div>
        <div class="flex flex-grow items-center px-2 py-1">{props.value}</div>
      </div>
    )
  },
})
