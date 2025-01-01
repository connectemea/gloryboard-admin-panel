import { Label } from "../ui/label"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import autoAnimate from '@formkit/auto-animate'
import { useState, useRef, useEffect } from 'react'

function ComboxInput({ label, name, value, onChange, options, disabled, open, setOpen }) {
    const parent = useRef(null)
  
    useEffect(() => {
      parent.current && autoAnimate(parent.current)
    }, [parent])
    return (
        <div className="form-control space-y-2  w-full" ref={parent}>
            {label && <Label className="text-sm text-white/50">{label}</Label>}
            <Button
                disabled={disabled}
                name={name}
                onClick={() => setOpen(!open)}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
            >
                {value
                    ? options.find((option) => option.value === value)?.label
                    : "Select framework..."}
                <ChevronsUpDown className="opacity-50" />
            </Button>
            {open && (
                <Command >
                    <CommandInput placeholder="Search item..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup >
                            {options.map((option) => (
                                <CommandItem
                                    disabled={disabled}
                                    key={option.value}
                                    value={option.value}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {option.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            )}
            {/* </PopoverContent>
            </Popover> */}
        </div>
    );
}


export default ComboxInput;