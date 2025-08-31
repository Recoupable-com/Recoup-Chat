import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tables } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pause, Trash2 } from "lucide-react";
import { useState } from "react";
import { useUpdateScheduledAction } from "@/hooks/useUpdateScheduledAction";

// Helper function to parse cron expression into frequency and time
const parseCronToFrequencyAndTime = (cronExpression: string): { frequency: string; time: string } => {
  try {
    const parts = cronExpression.split(' ');
    if (parts.length >= 5) {
      const minute = parts[0];
      const hour = parts[1];
      const dayOfMonth = parts[2];
      const month = parts[3];
      const dayOfWeek = parts[4];
      
      // Format time
      const hourNum = parseInt(hour);
      const minuteNum = parseInt(minute);
      const period = hourNum >= 12 ? 'PM' : 'AM';
      const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
      const timeStr = `${displayHour}:${minuteNum.toString().padStart(2, '0')} ${period}`;
      
      // Determine frequency
      if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
        return { frequency: 'Daily', time: timeStr };
      } else if (dayOfMonth === '*' && month === '*' && dayOfWeek !== '*') {
        return { frequency: 'Weekly', time: timeStr };
      } else if (dayOfMonth !== '*' && month === '*' && dayOfWeek === '*') {
        return { frequency: 'Monthly', time: timeStr };
      } else {
        return { frequency: 'Once', time: timeStr };
      }
    }
    return { frequency: 'Daily', time: '9:00 AM' };
  } catch {
    return { frequency: 'Daily', time: '9:00 AM' };
  }
};

// Helper function to convert frequency and time back to cron expression
const convertFrequencyAndTimeToCron = (frequency: string, time: string): string => {
  try {
    // Parse time (e.g., "9:00 AM" -> hour: 9, minute: 0)
    const timeMatch = time.match(/(\d+):(\d+)\s*(AM|PM)/);
    if (!timeMatch) {
      throw new Error('Invalid time format');
    }
    
    let hour = parseInt(timeMatch[1]);
    const minute = parseInt(timeMatch[2]);
    const period = timeMatch[3];
    
    // Convert to 24-hour format
    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }
    
    // Generate cron based on frequency
    switch (frequency) {
      case 'Daily':
        return `${minute} ${hour} * * *`;
      case 'Weekly':
        // Default to Monday (1) for weekly
        return `${minute} ${hour} * * 1`;
      case 'Monthly':
        // Default to 1st day of month for monthly
        return `${minute} ${hour} 1 * *`;
      case 'Once':
        // For "Once", we'll use the current date
        const now = new Date();
        return `${minute} ${hour} ${now.getDate()} ${now.getMonth() + 1} *`;
      default:
        return `${minute} ${hour} * * *`; // Default to daily
    }
  } catch {
    return '0 9 * * *'; // Default fallback
  }
};

type ScheduledAction = Tables<"scheduled_actions">;

interface ScheduledActionDetailsDialogProps {
  children: React.ReactNode;
  action: ScheduledAction;
  onDelete?: () => void;
}

const ScheduledActionDetailsDialog: React.FC<
  ScheduledActionDetailsDialogProps
> = ({ children, action, onDelete }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(action.title);
  const [editPrompt, setEditPrompt] = useState(action.prompt);
  
  // Parse the actual schedule from the task
  const { frequency: initialFrequency, time: initialTime } = parseCronToFrequencyAndTime(action.schedule);
  const [editFrequency, setEditFrequency] = useState(initialFrequency);
  const [editTime, setEditTime] = useState(initialTime);
  
  const { updateAction, isLoading } = useUpdateScheduledAction();

  const handleSave = async () => {
    try {
      // Convert frequency and time back to cron expression
      const newCronExpression = convertFrequencyAndTimeToCron(editFrequency, editTime);
      
      await updateAction({
        actionId: action.id,
        updates: {
          title: editTitle,
          prompt: editPrompt,
          schedule: newCronExpression
        },
        onSuccess: () => {
          setIsDialogOpen(false);
        },
        successMessage: "Task updated successfully"
      });
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };



  const handleDelete = () => {
    setIsDialogOpen(false);
    onDelete?.();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Edit Task</h2>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Name Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Name</label>
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full"
              placeholder="Enter task name"
            />
          </div>

          {/* Instructions Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Instructions</label>
            <Textarea
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              className="w-full min-h-[80px] resize-none"
              placeholder="Enter instructions..."
            />
          </div>

          {/* When Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">When</label>
            <div className="flex gap-2">
              <Select value={editFrequency} onValueChange={setEditFrequency}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Once">Once</SelectItem>
                </SelectContent>
              </Select>
              <Select value={editTime} onValueChange={setEditTime}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] p-1">
                  {/* Early Morning */}
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 rounded-sm mb-1">Early Morning</div>
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
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 rounded-sm mb-1 mt-2">Morning</div>
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
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 rounded-sm mb-1 mt-2">Afternoon</div>
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
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 rounded-sm mb-1 mt-2">Evening</div>
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
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-8 justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                // TODO: Implement pause functionality
              }}
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gray-900 hover:bg-gray-800"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduledActionDetailsDialog;
