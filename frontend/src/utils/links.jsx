import React from "react";

import { ImWhatsapp } from "react-icons/im";
import { LiaMailBulkSolid } from "react-icons/lia";

const links = [
  {
    text: "whatsapp",
    path: ".",
    icon: <ImWhatsapp />,
  },
  {
    text: "send bulk whatsapp",
    path: "bulk-whatsapp",
    icon: <LiaMailBulkSolid />,
  },
];

export default links;
