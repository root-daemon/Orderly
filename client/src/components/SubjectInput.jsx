import React from "react";
import { Input } from "@/components/ui/input";

const SubjectInput = ({ subjectInput, handleEnter, setSubjectInput }) => {
  return (
    <div className="w-full mb-8">
      <Input
        value={subjectInput}
        onKeyDown={handleEnter}
        placeholder="Add your subjects (press enter to add)"
        type="text"
        onChange={(e) => setSubjectInput(e.target.value)}
        className="py-6 select-none"
      />
    </div>
  );
};

export default SubjectInput;
