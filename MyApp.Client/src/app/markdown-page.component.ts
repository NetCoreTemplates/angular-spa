import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { marked } from 'marked'

@Component({
    selector: 'markdown-page',
    template: `
    <div class="max-w-screen-md mt-8 mb-20 mx-auto">
    @if (error) {
        <div class="error-message">
            {{ error }}
        </div>
    }
    @else {
        @if (frontmatter()['title']) {  
            <h1 class="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
                {{ frontmatter()['title'] }}
            </h1>
        }
            <div class="prose dark:prose-invert lg:prose-xl text-left mt-8 mb-20" [innerHTML]="previewHtml()"></div>
    }
    </div>
    `,
  })
  export class MarkdownPageComponent implements OnInit {
    route = inject(ActivatedRoute);

    page?: string;
    error?: string;
    frontmatter = signal({} as Record<string, any>);
    previewHtml = signal('');
  
    ngOnInit(): void {
      // Get the markdown file name from the route data
      this.route.data.subscribe((data:any) => {
        if (data['page']) {
          this.page = data['page'];
          this.loadMarkdownContent();
        }
      });
    }
  
    loadMarkdownContent(): void {
      const path = `pages/${this.page}`;
      
      this.error = undefined;
      fetch(path)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Error loading markdown file: ${res.statusText}`);
            } else {
                return res.text();
            }
        }).then((md:string) => {
            const { frontmatter, content } = matter(md);
            this.frontmatter.set(frontmatter);
            this.previewHtml.set(marked.parse(content, { async:false }));
        })
        .catch((err) => {
            this.error = err.message;
        });
    }
  }
  
/** Extracts frontmatter from a Markdown string */
function matter(md:string) {
    // Check if the content starts with a frontmatter delimiter
    if (!md.startsWith('---')) {
      return {
        frontmatter: {},
        content: md
      };
    }
  
    // Find the end of the frontmatter section
    const endFrontmatterPos = md.indexOf('---', 3);
    if (endFrontmatterPos === -1) {
      return {
        frontmatter: {},
        content: md
      };
    }
  
    // Extract the frontmatter string
    const frontmatterStr = md.substring(3, endFrontmatterPos).trim();
    
    // Parse the frontmatter into an object
    const frontmatter:Record<string,any> = {};
    const lines = frontmatterStr.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine === '') continue;
      
      // Find the first colon that separates key and value
      const colonIndex = trimmedLine.indexOf(':');
      if (colonIndex !== -1) {
        const key = trimmedLine.substring(0, colonIndex).trim();
        let value = trimmedLine.substring(colonIndex + 1).trim();
        
        // Handle quoted strings
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.substring(1, value.length - 1);
        }
        
        // Handle arrays (simple implementation)
        if (value.startsWith('[') && value.endsWith(']')) {
          try {
            frontmatter[key] = JSON.parse(value);
          } catch (e) {
            // If JSON parsing fails, treat as string
            frontmatter[key] = value.substring(1, value.length - 1).split(',').map(item => item.trim());
          }
        } else {
            frontmatter[key] = value;
        }
      }
    }
  
    // Return the frontmatter and the content after the frontmatter
    return {
      frontmatter,
      content: md.substring(endFrontmatterPos + 3).trim()
    };
  }