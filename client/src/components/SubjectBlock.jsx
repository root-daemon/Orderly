import React from "react";

const SubjectBlock = ({ subjects, removeSubject }) => {
  return (
    <>
      <h1 className="self-start font-semibold text-xl mb-4 select-none">
        Your Subjects:
      </h1>
      <div className="flex flex-wrap justify-start items-start w-full gap-2 mb-4">
        {subjects.length > 1 ? (
          subjects.map((subject) =>
            subject === "None" ? (
              ""
            ) : (
              <span
                key={subject}
                className="bg-[#232323] text-white px-3 py-1.5 rounded-lg cursor-pointer select-none"
                onClick={() => {
                  removeSubject(subject);
                }}
              >
                {subject}
              </span>
            )
          )
        ) : (
          <p className="">You haven't added any subjects yet</p>
        )}
      </div>
    </>
  );
};

export default SubjectBlock;
