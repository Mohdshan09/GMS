import { Bike, Dumbbell, Weight, Cable, CircleDot, LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EquipmentCategory, EquipmentCondition } from "@/lib/types";

export const CATEGORY_ICON: Record<EquipmentCategory, LucideIcon> = {
  "Cardio": Bike,
  "Strength Machines": Dumbbell,
  "Free Weights": Weight,
  "Functional": Cable,
  "Accessories": CircleDot,
};

const conditionTone: Record<EquipmentCondition, Parameters<typeof Badge>[0]["tone"]> = {
  excellent: "success",
  good: "primary",
  "needs-service": "warning",
  "out-of-order": "danger",
};

const conditionLabel: Record<EquipmentCondition, string> = {
  excellent: "Excellent",
  good: "Good",
  "needs-service": "Needs Service",
  "out-of-order": "Out of Order",
};

export function ConditionBadge({ condition }: { condition: EquipmentCondition }) {
  return <Badge tone={conditionTone[condition]}>{conditionLabel[condition]}</Badge>;
}
