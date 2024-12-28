import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Input } from "../ui/input"
import { Search } from "lucide-react"
import { useState } from "react"

function SearchSelectInput({ disabled, label, name, value, onChange, options }) {
    const [searchQuery, setSearchQuery] = useState("")

    const handleSelectChange = (selectedValue) => {
        onChange({
            target: { name, value: selectedValue }
        })
    }

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="form-control space-y-1">
            {label && <Label className="text-sm text-white/50">{label}</Label>}
            <Select name={name} value={value} onValueChange={handleSelectChange} disabled={disabled}>
                <SelectTrigger>
                    <SelectValue placeholder={`${label}`} />
                </SelectTrigger>
                <SelectContent>
                    <div className="px-1 pt-1 pb-2">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="pl-8 bg-transparent border-white/10 text-white placeholder:text-white/50"
                            />
                        </div>
                    </div>
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <SelectItem key={index} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))
                    ) : (
                        <div className="relative flex items-center justify-center py-4 text-sm text-white/50">
                            No results found
                        </div>
                    )}
                </SelectContent>
            </Select>
        </div>
    )
}

export default SearchSelectInput