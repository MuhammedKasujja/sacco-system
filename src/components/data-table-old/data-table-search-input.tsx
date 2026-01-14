import { Search } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'

type Props = {
  onSearch: (value?: string) => void
}

export function DataTableSearchInput({ onSearch }: Props) {
  return (
    <InputGroup className="w-full min-w-0 max-w-sm">
      <InputGroupInput
        id="search"
        placeholder="Search..."
        onChange={(event) => {
          onSearch?.(event.target.value)
        }}
        className="max-w-sm"
      />
      <InputGroupAddon align="inline-start">
        <Search />
      </InputGroupAddon>
    </InputGroup>
  )
}
