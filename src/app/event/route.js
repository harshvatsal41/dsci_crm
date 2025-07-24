import { NextResponse } from "next/server";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import EventOutreach from "@/Mongo/Model/DataModels/yeaslyEvent";
import sanitizeInput from "@/Helper/sanitizeInput";
import util from '@/Helper/apiUtils';
import mongoose from "mongoose";

// Import all related models
import Blog from "@/Mongo/Model/DataModels/Blog";
import Collaboration from "@/Mongo/Model/DataModels/Collaboration";
import CollabSubCategory from "@/Mongo/Model/DataModels/CollabSubCatagory";
import Faq from "@/Mongo/Model/DataModels/Faq";
import FocusArea from "@/Mongo/Model/DataModels/FocusArea";
import Speaker from "@/Mongo/Model/DataModels/Speaker";
import Testimonial from "@/Mongo/Model/DataModels/Testimonial";
import Ticket from "@/Mongo/Model/DataModels/Ticket";

// Enhanced cleaner function that removes ALL IDs and timestamps
const cleanDocument = (doc) => {
  if (!doc) return null;
  
  const document = doc.toObject ? doc.toObject() : doc;
  
  // Remove all MongoDB internal fields and timestamps
  const { 
    _id, id, __v, 
    createdAt, updatedAt, deletedAt,
    createdBy, updatedBy, deletedBy,
    isDeleted, yeaslyEventId, eventId,
    // Remove all relationship IDs
    focusAreaIds, speakers, faqIds, testimonialIds, 
    ticketIds, blogs, sponsorGroups, eventIds, 
    sessionIds, subCategory, sponsors,
    // Remove any other potential ID fields
    ...rest 
  } = document;
  
  // Recursively clean nested objects
  const cleanNested = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(item => typeof item === 'object' ? cleanNested(item) : item);
    } else if (obj && typeof obj === 'object') {
      const cleaned = {};
      for (const key in obj) {
        if (key === '_id' || key === 'id' || key.endsWith('Id') || key.endsWith('Ids')) {
          continue; // Skip all ID fields
        }
        cleaned[key] = typeof obj[key] === 'object' ? cleanNested(obj[key]) : obj[key];
      }
      return cleaned;
    }
    return obj;
  };
  
  return cleanNested(rest);
};

export async function GET(req) {
  await util.connectDB();

  try {
    const { searchParams } = req.nextUrl;
    const globalFetch = searchParams.get("globalfetch");

    if (!globalFetch) {
      return NextResponse.json(apiResponse({
        message: "Missing required parameter: globalFetch",
        statusCode: STATUS_CODES.BAD_REQUEST
      }), { status: STATUS_CODES.BAD_REQUEST });
    }

    // Find the main event
    const event = await EventOutreach.findOne({ globalFetch: globalFetch.trim() });
    
    if (!event) {
      return NextResponse.json(apiResponse({
        message: "Event not found",
        statusCode: STATUS_CODES.NOT_FOUND
      }), { status: STATUS_CODES.NOT_FOUND });
    }

    // Aggregate all related data in parallel
    const [
      focusAreas,
      speakers,
      faqs,
      testimonials,
      tickets,
      blogs,
      sponsorGroupsWithDetails
    ] = await Promise.all([
      // Focus Areas
      FocusArea.find({ 
        _id: { $in: event.focusAreaIds },
        isDeleted: false 
      }),
      
      // Speakers
      Speaker.find({ 
        _id: { $in: event.speakers },
        isDeleted: false 
      }),
      
      // FAQs
      Faq.find({ 
        _id: { $in: event.faqIds },
        isDeleted: false 
      }),
      
      // Testimonials
      Testimonial.find({ 
        _id: { $in: event.testimonialIds },
        isDeleted: false 
      }),
      
      // Tickets
      Ticket.find({ 
        _id: { $in: event.ticketIds },
        isDeleted: false 
      }),
      
      // Blogs
      Blog.find({ 
        yeaslyEventId: event._id,
        isDeleted: false 
      }),
      
      // Process sponsor groups with their subcategories and collaborations
      (async () => {
        const groups = [];
        
        for (const group of event.sponsorGroups) {
          const subCategory = await CollabSubCategory.findById(group.subCategory);
          const collaborations = await Collaboration.find({
            _id: { $in: group.sponsors },
            isDeleted: false
          });
          
          groups.push({
            subCategory: cleanDocument(subCategory),
            sponsors: collaborations.map(c => cleanDocument(c))
          });
        }
        
        return groups;
      })()
    ]);

    // Build the complete response
    const response = {
      event: cleanDocument(event),
      focusAreas: focusAreas.map(cleanDocument),
      speakers: speakers.map(cleanDocument),
      faqs: faqs.map(cleanDocument),
      testimonials: testimonials.map(cleanDocument),
      tickets: tickets.map(cleanDocument),
      blogs: blogs.map(cleanDocument),
      sponsorGroups: sponsorGroupsWithDetails
    };

    return NextResponse.json(apiResponse({
      message: "Event with all related data fetched successfully",
      data: response,
      statusCode: STATUS_CODES.SUCCESS,
    }), { status: STATUS_CODES.SUCCESS });

  } catch (error) {
    console.error("Error fetching event with related data:", error);
    return NextResponse.json(apiResponse({
      message: "Failed to fetch event with related data",
      statusCode: STATUS_CODES.INTERNAL_ERROR,
    }), { status: STATUS_CODES.INTERNAL_ERROR });
  }
}