import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/auth';
import { flattenObject, exportToCSV, exportToJSON, triggerInstitutionalNotice } from '../util/utils';
import { 
  BarChart3, BookOpen, CreditCard, User, Settings, Layout, 
  ChevronRight, LogOut, CheckCircle2, Clock, MapPin, Phone, 
  Briefcase, GraduationCap, ArrowRight, ShieldCheck, Mail, Globe,
  Calendar, Zap, Star, AlertCircle, FileText, Lock, Award, Search, Copy, Download
} from 'lucide-react';

