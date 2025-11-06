import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

const TimeSelect = ({ value, onValueChange, disabled }: TimeSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="flex-1">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-[300px] p-1">
        {/* Early Morning */}
        <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 rounded-sm mb-1">
          Early Morning
        </div>
        <SelectItem value="12:00 AM" className="py-2">12:00 AM</SelectItem>
        <SelectItem value="12:15 AM" className="py-2">12:15 AM</SelectItem>
        <SelectItem value="12:30 AM" className="py-2">12:30 AM</SelectItem>
        <SelectItem value="12:45 AM" className="py-2">12:45 AM</SelectItem>
        <SelectItem value="1:00 AM" className="py-2">1:00 AM</SelectItem>
        <SelectItem value="1:15 AM" className="py-2">1:15 AM</SelectItem>
        <SelectItem value="1:30 AM" className="py-2">1:30 AM</SelectItem>
        <SelectItem value="1:45 AM" className="py-2">1:45 AM</SelectItem>
        <SelectItem value="2:00 AM" className="py-2">2:00 AM</SelectItem>
        <SelectItem value="2:15 AM" className="py-2">2:15 AM</SelectItem>
        <SelectItem value="2:30 AM" className="py-2">2:30 AM</SelectItem>
        <SelectItem value="2:45 AM" className="py-2">2:45 AM</SelectItem>
        <SelectItem value="3:00 AM" className="py-2">3:00 AM</SelectItem>
        <SelectItem value="3:15 AM" className="py-2">3:15 AM</SelectItem>
        <SelectItem value="3:30 AM" className="py-2">3:30 AM</SelectItem>
        <SelectItem value="3:45 AM" className="py-2">3:45 AM</SelectItem>
        <SelectItem value="4:00 AM" className="py-2">4:00 AM</SelectItem>
        <SelectItem value="4:15 AM" className="py-2">4:15 AM</SelectItem>
        <SelectItem value="4:30 AM" className="py-2">4:30 AM</SelectItem>
        <SelectItem value="4:45 AM" className="py-2">4:45 AM</SelectItem>
        <SelectItem value="5:00 AM" className="py-2">5:00 AM</SelectItem>
        <SelectItem value="5:15 AM" className="py-2">5:15 AM</SelectItem>
        <SelectItem value="5:30 AM" className="py-2">5:30 AM</SelectItem>
        <SelectItem value="5:45 AM" className="py-2">5:45 AM</SelectItem>

        {/* Morning */}
        <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 rounded-sm mb-1 mt-2">
          Morning
        </div>
        <SelectItem value="6:00 AM" className="py-2">6:00 AM</SelectItem>
        <SelectItem value="6:15 AM" className="py-2">6:15 AM</SelectItem>
        <SelectItem value="6:30 AM" className="py-2">6:30 AM</SelectItem>
        <SelectItem value="6:45 AM" className="py-2">6:45 AM</SelectItem>
        <SelectItem value="7:00 AM" className="py-2">7:00 AM</SelectItem>
        <SelectItem value="7:15 AM" className="py-2">7:15 AM</SelectItem>
        <SelectItem value="7:30 AM" className="py-2">7:30 AM</SelectItem>
        <SelectItem value="7:45 AM" className="py-2">7:45 AM</SelectItem>
        <SelectItem value="8:00 AM" className="py-2">8:00 AM</SelectItem>
        <SelectItem value="8:15 AM" className="py-2">8:15 AM</SelectItem>
        <SelectItem value="8:30 AM" className="py-2">8:30 AM</SelectItem>
        <SelectItem value="8:45 AM" className="py-2">8:45 AM</SelectItem>
        <SelectItem value="9:00 AM" className="py-2">9:00 AM</SelectItem>
        <SelectItem value="9:15 AM" className="py-2">9:15 AM</SelectItem>
        <SelectItem value="9:30 AM" className="py-2">9:30 AM</SelectItem>
        <SelectItem value="9:45 AM" className="py-2">9:45 AM</SelectItem>
        <SelectItem value="10:00 AM" className="py-2">10:00 AM</SelectItem>
        <SelectItem value="10:15 AM" className="py-2">10:15 AM</SelectItem>
        <SelectItem value="10:30 AM" className="py-2">10:30 AM</SelectItem>
        <SelectItem value="10:45 AM" className="py-2">10:45 AM</SelectItem>
        <SelectItem value="11:00 AM" className="py-2">11:00 AM</SelectItem>
        <SelectItem value="11:15 AM" className="py-2">11:15 AM</SelectItem>
        <SelectItem value="11:30 AM" className="py-2">11:30 AM</SelectItem>
        <SelectItem value="11:45 AM" className="py-2">11:45 AM</SelectItem>

        {/* Afternoon */}
        <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 rounded-sm mb-1 mt-2">
          Afternoon
        </div>
        <SelectItem value="12:00 PM" className="py-2">12:00 PM</SelectItem>
        <SelectItem value="12:15 PM" className="py-2">12:15 PM</SelectItem>
        <SelectItem value="12:30 PM" className="py-2">12:30 PM</SelectItem>
        <SelectItem value="12:45 PM" className="py-2">12:45 PM</SelectItem>
        <SelectItem value="1:00 PM" className="py-2">1:00 PM</SelectItem>
        <SelectItem value="1:15 PM" className="py-2">1:15 PM</SelectItem>
        <SelectItem value="1:30 PM" className="py-2">1:30 PM</SelectItem>
        <SelectItem value="1:45 PM" className="py-2">1:45 PM</SelectItem>
        <SelectItem value="2:00 PM" className="py-2">2:00 PM</SelectItem>
        <SelectItem value="2:15 PM" className="py-2">2:15 PM</SelectItem>
        <SelectItem value="2:30 PM" className="py-2">2:30 PM</SelectItem>
        <SelectItem value="2:45 PM" className="py-2">2:45 PM</SelectItem>
        <SelectItem value="3:00 PM" className="py-2">3:00 PM</SelectItem>
        <SelectItem value="3:15 PM" className="py-2">3:15 PM</SelectItem>
        <SelectItem value="3:30 PM" className="py-2">3:30 PM</SelectItem>
        <SelectItem value="3:45 PM" className="py-2">3:45 PM</SelectItem>
        <SelectItem value="4:00 PM" className="py-2">4:00 PM</SelectItem>
        <SelectItem value="4:15 PM" className="py-2">4:15 PM</SelectItem>
        <SelectItem value="4:30 PM" className="py-2">4:30 PM</SelectItem>
        <SelectItem value="4:45 PM" className="py-2">4:45 PM</SelectItem>
        <SelectItem value="5:00 PM" className="py-2">5:00 PM</SelectItem>
        <SelectItem value="5:15 PM" className="py-2">5:15 PM</SelectItem>
        <SelectItem value="5:30 PM" className="py-2">5:30 PM</SelectItem>
        <SelectItem value="5:45 PM" className="py-2">5:45 PM</SelectItem>

        {/* Evening */}
        <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 rounded-sm mb-1 mt-2">
          Evening
        </div>
        <SelectItem value="6:00 PM" className="py-2">6:00 PM</SelectItem>
        <SelectItem value="6:15 PM" className="py-2">6:15 PM</SelectItem>
        <SelectItem value="6:30 PM" className="py-2">6:30 PM</SelectItem>
        <SelectItem value="6:45 PM" className="py-2">6:45 PM</SelectItem>
        <SelectItem value="7:00 PM" className="py-2">7:00 PM</SelectItem>
        <SelectItem value="7:15 PM" className="py-2">7:15 PM</SelectItem>
        <SelectItem value="7:30 PM" className="py-2">7:30 PM</SelectItem>
        <SelectItem value="7:45 PM" className="py-2">7:45 PM</SelectItem>
        <SelectItem value="8:00 PM" className="py-2">8:00 PM</SelectItem>
        <SelectItem value="8:15 PM" className="py-2">8:15 PM</SelectItem>
        <SelectItem value="8:30 PM" className="py-2">8:30 PM</SelectItem>
        <SelectItem value="8:45 PM" className="py-2">8:45 PM</SelectItem>
        <SelectItem value="9:00 PM" className="py-2">9:00 PM</SelectItem>
        <SelectItem value="9:15 PM" className="py-2">9:15 PM</SelectItem>
        <SelectItem value="9:30 PM" className="py-2">9:30 PM</SelectItem>
        <SelectItem value="9:45 PM" className="py-2">9:45 PM</SelectItem>
        <SelectItem value="10:00 PM" className="py-2">10:00 PM</SelectItem>
        <SelectItem value="10:15 PM" className="py-2">10:15 PM</SelectItem>
        <SelectItem value="10:30 PM" className="py-2">10:30 PM</SelectItem>
        <SelectItem value="10:45 PM" className="py-2">10:45 PM</SelectItem>
        <SelectItem value="11:00 PM" className="py-2">11:00 PM</SelectItem>
        <SelectItem value="11:15 PM" className="py-2">11:15 PM</SelectItem>
        <SelectItem value="11:30 PM" className="py-2">11:30 PM</SelectItem>
        <SelectItem value="11:45 PM" className="py-2">11:45 PM</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TimeSelect;

