
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"


function SelectInput({ label, name, value, onChange, options, disabled }) {
    const handleSelectChange = (selectedValue) => {
        onChange({
            target: { name, value: selectedValue }
        })
    }

    return (
        <div className="form-control space-y-1 w-full">
            {label && <Label className="text-sm text-white/50" >{label}</Label>}
            <Select name={name} value={value} onValueChange={handleSelectChange} disabled={disabled}>
                <SelectTrigger>
                    <SelectValue placeholder={`${label}`} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option, index) => (
                        <SelectItem key={index} value={option.value} disabled={option.disabled}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default SelectInput